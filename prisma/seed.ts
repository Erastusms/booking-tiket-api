import { PrismaClient, Role, Category, SeatAvailabilityStatus, BookingStatus, PaymentStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpassword',
      phoneNumber: '081234567890',
      idCardNumber: '1234567890123456',
      role: Role.ADMIN,
    }
  });

  const memberUser = await prisma.user.create({
    data: {
      fullName: 'Member User',
      email: 'member@example.com',
      password: 'hashedpassword',
      phoneNumber: '089876543210',
      idCardNumber: '6543210987654321',
      role: Role.MEMBER,
    }
  });

  // 2. Seed Stations
  const stations = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.station.create({
        data: {
          name: `Stasiun ${i}`,
          code: `ST${i + 1}`,
          city: faker.location.city(),
        }
      })
    )
  );

  // 3. Seed Wagon Categories
  const wagonCategories = await Promise.all(
    Object.values(Category).map((category) =>
      prisma.wagonCategory.create({
        data: {
          name: category,
          capacity: faker.number.int({ min: 30, max: 50 })
        }
      })
    )
  );

  // 4. Seed Trains and Wagons
  const trains = await Promise.all(
    Array.from({ length: 2 }).map(async (_, i) => {
      const train = await prisma.train.create({
        data: {
          name: `Kereta ${i + 1}`,
          code: `KR${i + 1}`
        }
      });

      await Promise.all(
        wagonCategories.map((category, index) =>
          prisma.wagon.create({
            data: {
              trainId: train.id,
              wagonCode: `W${i + 1}${index + 1}`,
              categoryId: category.id
            }
          })
        )
      );

      return train;
    })
  );

  // 5. Create Seats for each Wagon
  const wagons = await prisma.wagon.findMany();
  for (const wagon of wagons) {
    const category = wagonCategories.find(c => c.id === wagon.categoryId);
    const capacity = category?.capacity || 30;

    for (let i = 1; i <= capacity; i++) {
      await prisma.seat.create({
        data: {
          wagonId: wagon.id,
          seatNumber: `${wagon.wagonCode}-${i}`,
          seatAvailability: SeatAvailabilityStatus.AVAILABLE,
          row: Math.ceil(i / 4),
          column: String.fromCharCode(65 + ((i - 1) % 4)),
        }
      });
    }
  }

  // 6. Create a Schedule
  const departure = stations[0];
  const arrival = stations[1];
  const train = trains[0];

  const schedule = await prisma.schedule.create({
    data: {
      trainId: train.id,
      departureStationId: departure.id,
      arrivalStationId: arrival.id,
      departureTime: faker.date.soon({ days: 5 }),
      arrivalTime: faker.date.soon({ days: 5, refDate: new Date(Date.now() + 2 * 60 * 60 * 1000) }),
    }
  });

  // 7. Create Fares for the Schedule
  for (const category of wagonCategories) {
    await prisma.fare.create({
      data: {
        scheduleId: schedule.id,
        categoryId: category.id,
        price: faker.number.float({ min: 100000, max: 500000 })
      }
    });
  }

  // 8. Assign ScheduleSeat
  const seats = await prisma.seat.findMany({
    take: 10
  });

  for (const seat of seats) {
    await prisma.scheduleSeat.create({
      data: {
        scheduleId: schedule.id,
        seatId: seat.id,
        isBooked: false
      }
    });
  }

  // 9. Create a Booking
  const bookedSeat = seats[0];

  const booking = await prisma.booking.create({
    data: {
      code: faker.string.alphanumeric(8),
      userId: memberUser.id,
      scheduleId: schedule.id,
      seatId: bookedSeat.id,
      passengerName: memberUser.fullName,
      totalPassenger: 1,
      status: BookingStatus.PAID,
      updatedAt: new Date()
    }
  });

  // 10. Booking History
  await prisma.bookingHistory.create({
    data: {
      bookingId: booking.id,
      action: 'BOOKED',
      previousData: {},
      updatedAt: new Date(),
      createdBy: memberUser.fullName,
      updatedBy: memberUser.fullName
    }
  });

  // 11. Payment & Log
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: 250000,
      status: PaymentStatus.SUCCESS,
      paymentMethod: 'Credit Card',
      paymentDate: new Date()
    }
  });

  await prisma.paymentLog.create({
    data: {
      paymentId: payment.id,
      message: 'Payment processed successfully',
      status: PaymentStatus.SUCCESS
    }
  });

  console.log('✅ Seeder selesai dijalankan!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
