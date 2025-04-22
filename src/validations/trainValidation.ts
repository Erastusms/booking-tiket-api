import { z } from 'zod';

export const createTrainSchema = z.object({
  name: z.string().min(1),
  code: z.string().length(3, 'Kode harus terdiri dari 3 karakter')
});

export const updateTrainSchema = createTrainSchema.partial()
