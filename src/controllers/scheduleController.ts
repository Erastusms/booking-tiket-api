import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/responseHandler';
import {
  createScheduleService,
  createSchedulesFromExcel,
} from '../services/scheduleService';

export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await createScheduleService(req.body);
  return successResponse(res, 'Jadwal kereta berhasil dibuat', schedule);
};

export const uploadScheduleExcel = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return errorResponse(res, 'No file uploaded', 400);
  }

  const schedules = await createSchedulesFromExcel(file.buffer);
  return successResponse(res, 'Schedules created successfully', schedules);
};
