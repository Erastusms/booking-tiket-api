import { z } from 'zod';

export const createFareSchema = z.object({
  scheduleId: z.string().uuid(),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
});

export const updateFareSchema = createFareSchema.partial();

export type CreateFareSchemaType = z.infer<typeof createFareSchema>;
