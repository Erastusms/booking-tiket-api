import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/responseHandler';
import {
  createScheduleService,
  deleteScheduleService,
  getDetailScheduleService,
  // createSchedulesFromExcel,
  getScheduleService,
  updateScheduleService,
} from '../services/scheduleService';
import { TokenPayload } from '../middlewares/auth';
import { MESSAGE } from '../constants';

export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await createScheduleService(req.body);
  return successResponse(res, 'Jadwal kereta berhasil dibuat', schedule);
};

// export const uploadScheduleExcel = async (req: Request, res: Response) => {
//   const file = req.file;
//   if (!file) {
//     return errorResponse(res, 'No file uploaded', 400);
//   }

//   const schedules = await createSchedulesFromExcel(file.buffer);
//   return successResponse(res, 'Schedules created successfully', schedules);
// };

export const getSchedules = async (req: Request, res: Response) => {
  const { from, to, date } = req.query;
  const schedules = await getScheduleService({
    from: from as string,
    to: to as string,
    date: date as string,
  });
  return successResponse(res, 'Berhasil mengambil data jadwal kereta', schedules);
};

export const getScheduleDetail = async (req: Request, res: Response) => {
  const scheduleDetail = await getDetailScheduleService(req.params.id);
  console.log(scheduleDetail)
  if (!scheduleDetail) {
    return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
  }
  return successResponse(res, 'Menampilkan detail jadwal kereta', scheduleDetail);
};

export const updateSchedule = async (req: Request, res: Response) => {
  const schedule = await updateScheduleService(req.params.id, req.body);
  return successResponse(res, 'Berhasil memperbarui data jadwal kereta', schedule);
};

export const removeSchedule = async (req: Request, res: Response) => {
  await deleteScheduleService(req.params.id);
  return successResponse(res, 'Berhasil menghapus data jadwal kereta', null);
};
