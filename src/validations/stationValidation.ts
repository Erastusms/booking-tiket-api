import { z } from 'zod';

export const createStationSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).max(10),
  city: z.string().min(1),
});

export const updateStationSchema = createStationSchema.partial();
