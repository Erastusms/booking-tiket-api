import { z } from 'zod';

export const createScheduleSeatSchema = z.object({
  scheduleId: z.string().uuid(),
  seatId: z.string().uuid(),
  isBooked: z.boolean().optional(),
});

export const createBatchScheduleSeatSchema = z.array(createScheduleSeatSchema);

export const updateScheduleSeatSchema = z.object({
  isBooked: z.boolean(),
});

export type CreateScheduleSeatInput = z.infer<typeof createScheduleSeatSchema>;
export type CreateBatchScheduleSeatInput = z.infer<typeof createScheduleSeatSchema>;
export type UpdateScheduleSeatInput = z.infer<typeof updateScheduleSeatSchema>;
