import { z } from 'zod';

export const createScheduleSchema = z.object({
  trainId: z.string().uuid(),
  departureStationId: z.string().uuid(),
  arrivalStationId: z.string().uuid(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),
});

export const updateScheduleSchema = z.object({
  trainId: z.string().uuid().optional(),
  departureStationId: z.string().uuid().optional(),
  arrivalStationId: z.string().uuid().optional(),
  departureTime: z.string().datetime().optional(),
  arrivalTime: z.string().datetime().optional(),
});
