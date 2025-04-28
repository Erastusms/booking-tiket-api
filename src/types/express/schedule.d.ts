import { z } from 'zod';
import { createScheduleSchema, updateScheduleSchema } from '../../validations/scheduleValidation';

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
