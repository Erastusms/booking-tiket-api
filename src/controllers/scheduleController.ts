import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/responseHandler';
import {
  createScheduleService,
  createSchedulesFromExcel,
  getScheduleService,
} from '../services/scheduleService';
import { TokenPayload } from '../middlewares/auth';

export const createSchedule = async (req: Request, res: Response) => {
  const { username } = req.user as TokenPayload;
  req.body.createdBy = username;
  req.body.updatedBy = username;
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

export const getSchedules = async (req: Request, res: Response) => {
  const { from, to, date } = req.query;
  const schedules = await getScheduleService({
    from: from as string,
    to: to as string,
    date: date as string,
  });
  return successResponse(
    res,
    'Berhasil mengambil data jadwal kereta',
    schedules
  );
};
