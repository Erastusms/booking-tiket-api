import { z } from 'zod';

export const scheduleSchema = z.object({
  trainId: z.string().uuid(),
  departureStationId: z.string().uuid(),
  arrivalStationId: z.string().uuid(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),
  price: z.number().positive(),
});
