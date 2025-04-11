import { z } from 'zod';

export const createTrainSchema = z.object({
  name: z.string().min(1),
  code: z.string().length(3, 'Kode harus terdiri dari 3 karakter'),
  capacity: z.number().int().positive(),
});

export const updateTrainSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().length(3).optional(),
  capacity: z.number().int().positive().optional(),
});
