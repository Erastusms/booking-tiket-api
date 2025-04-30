import { z } from 'zod';

export const createSeatSchema = z.object({
  wagonId: z.string().uuid(),
  row: z.preprocess((val) => Number(val), z.number()),
  column: z.string().min(1),
});
