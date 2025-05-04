import { z } from 'zod';

export const createBookingSchema = z.object({
  scheduleId: z.string().uuid(),
  seatId: z.string().uuid(),
  passengerName: z.string().min(1),
  totalPassenger: z.number().int().min(1),
});

export const updateBookingSchema = z.object({
  passengerName: z.string().min(1).optional(),
  totalPassenger: z.number().int().min(1).optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED'], {
    required_error: 'status is required and must be one of PENDING, PAID, CANCELLED',
  }),
});

export const bookingIdParamSchema = z.object({
  id: z.string().uuid(),
});
