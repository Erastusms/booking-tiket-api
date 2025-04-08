import { Request, Response } from 'express';
import { successResponse } from '../utils/responseHandler';
import { createScheduleService } from '../services/scheduleService';

export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await createScheduleService(req.body);
  return successResponse(res, 'Jadwal kereta berhasil dibuat', schedule);
};
