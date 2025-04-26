import { z } from 'zod';

export const createSeatSchema = z.object({
  wagonId: z.string().uuid(),
  row: z.number().min(1),
  column: z.string().min(1),
});
