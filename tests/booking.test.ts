import request from 'supertest';
import prisma from '../src/config/prisma';
import app from '../src/app';
import { tokenUser } from './setup';
import redis from '../src/utils/redis';

let token: string;
let scheduleId: string;
let seatId: string;

beforeAll(async () => {
  const schedule = await prisma.schedule.create({
    data: {
      trainId: 'train-123',
      departureStationId: 'station-1',
      arrivalStationId: 'station-2',
      departureTime: new Date(Date.now() + 60 * 60 * 1000),
      arrivalTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
  });

  const seat = await prisma.seat.create({
    data: {
      wagonId: 'wagon-1',
      seatNumber: 'A1',
      seatAvailability: 'AVAILABLE',
      row: 1,
      column: 'A',
    },
  });

  await prisma.scheduleSeat.create({
    data: {
      scheduleId: schedule.id,
      seatId: seat.id,
      isBooked: false,
    },
  });

  scheduleId = schedule.id;
  seatId = seat.id;
});

describe('POST /api/v1/booking', () => {
  it('✅ should successfully create a booking', async () => {
    const res = await request(app)
      .post('/api/v1/booking')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        scheduleId,
        seatId,
        passengerName: 'John Wick',
        totalPassenger: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('code');
    expect(res.body.message).toBe('Booking berhasil dibuat');

    // Simpan ID untuk test selanjutnya
    await prisma.booking.delete({ where: { id: res.body.data.id } });
    await prisma.scheduleSeat.update({
      where: {
        scheduleId_seatId: {
          scheduleId,
          seatId,
        },
      },
      data: {
        isBooked: false,
      },
    });
  });

  it('❌ should fail if seat is already booked', async () => {
    await prisma.scheduleSeat.update({
      where: { scheduleId_seatId: { scheduleId, seatId } },
      data: { isBooked: true },
    });

    const res = await request(app)
      .post('/api/v1/booking')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        scheduleId,
        seatId,
        passengerName: 'Jane Doe',
        totalPassenger: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Kursi sudah dibooking/i);

    await prisma.scheduleSeat.update({
      where: { scheduleId_seatId: { scheduleId, seatId } },
      data: { isBooked: false },
    });
  });

  it('❌ should fail if seat is being processed (redis lock)', async () => {
    const lockKey = `lock:booking:${seatId}`;
    await redis.set(lockKey, 'LOCK-TEST', 'PX', 10000); // Simulasi seat sedang diproses

    const res = await request(app)
      .post('/api/v1/booking')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        scheduleId,
        seatId,
        passengerName: 'Lock Test',
        totalPassenger: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Seat sedang diproses/i);

    await redis.del(lockKey);
  });

  it('❌ should fail if schedule-seat relation not found', async () => {
    const newSeat = await prisma.seat.create({
      data: {
        wagonId: 'wagon-2',
        seatNumber: 'B1',
        seatAvailability: 'AVAILABLE',
        row: 2,
        column: 'B',
      },
    });

    const res = await request(app)
      .post('/api/v1/booking')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        scheduleId,
        seatId: newSeat.id,
        passengerName: 'Ghost Seat',
        totalPassenger: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Jadwal atau kursi tidak ditemukan/i);

    await prisma.seat.delete({ where: { id: newSeat.id } });
  });

  it('❌ should fail with invalid input (validation)', async () => {
    const res = await request(app)
      .post('/api/v1/booking')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        scheduleId: 'invalid-uuid',
        seatId: 123,
        passengerName: '',
        totalPassenger: 0,
      });

    expect(res.status).toBe(422); // Zod validation error (adjust if needed)
    expect(res.body).toHaveProperty('errors');
  });
});

afterAll(async () => {
  await prisma.booking.deleteMany();
  await prisma.scheduleSeat.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.$disconnect();
  await redis.quit();
});
