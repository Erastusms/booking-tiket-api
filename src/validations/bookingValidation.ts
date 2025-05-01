import { z } from 'zod';

export const createBookingSchema = z.object({
  scheduleId: z.string().uuid(),
  seatId: z.string().uuid(),
  passengerName: z.string().min(1),
  totalPassenger: z.number().int().min(1),
});

export const bookingIdParamSchema = z.object({
  id: z.string().uuid(),
});
