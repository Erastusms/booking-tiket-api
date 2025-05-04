import { BookingStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateBookingInput } from '../types/express/booking';
import { generateBookingCode } from '../utils/booking-generator';
import redis from '../utils/redis';
import { LOCK_EXPIRATION } from '../constants';

interface BookingHistoryParams {
  bookingId: string;
  action: string;
  previousData: any;
  userId: string;
}

export const createBookingService = async (data: CreateBookingInput) => {
  const lockKey = `lock:booking:${data.seatId}`;
  const lockValue = 'LOCK - ' + new Date().getTime();

  // Ambil lock Redis
  const isLocked = await redis.set(lockKey, lockValue, 'PX', LOCK_EXPIRATION, 'NX');

  if (!isLocked) {
    return { message: 'Seat sedang diproses, silakan coba beberapa saat lagi' };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const scheduleSeat = await tx.scheduleSeat.findFirst({
        where: {
          scheduleId: data.scheduleId,
          seatId: data.seatId,
        },
      });

      if (!scheduleSeat) {
        return { message: 'Jadwal atau kursi tidak ditemukan' };
      }

      if (scheduleSeat.isBooked) {
        return { message: 'Kursi sudah dibooking' };
      }

      await tx.scheduleSeat.update({
        where: { id: scheduleSeat.id },
        data: { isBooked: true },
      });

      return await tx.booking.create({
        data: {
          ...data,
          status: BookingStatus.PENDING,
          updatedAt: new Date(),
          code: generateBookingCode(),
        },
      });
    });
  } finally {
    // Hapus lock hanya jika masih milik kita
    const currentLockValue = await redis.get(lockKey);
    if (currentLockValue === lockValue) {
      await redis.del(lockKey);
    }
  }
};

export const getMyBookingsService = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      schedule: true,
      seat: true,
    },
  });
};

export const getBookingByIdService = async (id: string, userId: string) => {
  return prisma.booking.findFirst({
    where: { id, userId },
    include: {
      schedule: true,
      seat: true,
      payments: true,
    },
  });
};

export const deleteBookingService = async (id: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id, userId, status: 'PENDING' },
  });

  if (!booking) return null;

  await prisma.scheduleSeat.updateMany({
    where: {
      scheduleId: booking.scheduleId,
      seatId: booking.seatId,
    },
    data: { isBooked: false },
  });

  await prisma.booking.delete({ where: { id } });
  return booking;
};

export const updateBookingService = async (data: any) => {
  const { bookingId, scheduleId, seatId, status, ...res } = data;
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      ...res,
      status,
      updatedAt: new Date(),
    },
  });

  await prisma.scheduleSeat.updateMany({
    where: { scheduleId, seatId },
    data: { isBooked: status === 'PAID' ? true : false },
  });

  return updated;
};

// Booking History
export const logBookingHistory = async ({
  bookingId,
  action,
  previousData,
  userId,
}: BookingHistoryParams) => {
  await prisma.bookingHistory.create({
    data: {
      bookingId,
      action,
      previousData,
      createdAt: new Date(),
      createdBy: userId,
      updatedAt: new Date(),
      updatedBy: userId,
    },
  });
};
