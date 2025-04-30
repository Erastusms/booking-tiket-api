import { Request, Response } from 'express';
import {
  createBatchScheduleSeatService,
  createScheduleSeatService,
  getScheduleSeatsByScheduleService,
  updateScheduleSeatService,
} from '../services/scheduleSeatService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { parseExcelFile } from '../utils/excelHelper';
import { getDetailScheduleService } from '../services/scheduleService';
import { MESSAGE } from '../constants';

export const createScheduleSeat = async (req: Request, res: Response) => {
  const scheduleSeat = await createScheduleSeatService(req.body);
  return successResponse(res, 'Schedule Seat berhasil dibuat', scheduleSeat);
};

export const getScheduleSeatsBySchedule = async (req: Request, res: Response) => {
  const scheduleSeats = await getScheduleSeatsByScheduleService(req.params.scheduleId);
  return successResponse(res, 'Menampilkan Schedule Seat', scheduleSeats);
};

export const createBatchScheduleSeat = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return errorResponse(res, 'Tidak ada file terupload', 400);
  }
  const scheduleSeats = parseExcelFile<{ seatId: string; scheduleId: string }>({
    filePath: file.path,
  });
  const validScheduleSeats = [];
  for (const row of scheduleSeats) {
    const { seatId, scheduleId } = row;
    if (!seatId || !scheduleId) continue;

    const schedule = await getDetailScheduleService(scheduleId);

    if (!schedule) {
      return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
    }

    validScheduleSeats.push({ seatId, scheduleId });
  }

  const result = await createBatchScheduleSeatService(validScheduleSeats);
  return successResponse(res, 'Schedule Seat Batch berhasil dibuat', result);
};

export const updateScheduleSeat = async (req: Request, res: Response) => {
  const updatedSeat = await updateScheduleSeatService(req.params.id, req.body);
  return successResponse(res, 'Schedule Seat berhasil diperbarui', updatedSeat);
};
