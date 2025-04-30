import { Request, Response } from 'express';
import {
  createBatchSeatsService,
  createSeatService,
  deleteSeatService,
  getAllSeatsServiceByWagon,
} from '../services/seatService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { MESSAGE } from '../constants';
import { getWagonByIdService } from '../services/wagonService';
import { parseExcelFile } from '../utils/excelHelper';
import { SeatAvailabilityStatus } from '@prisma/client';

export const createSeat = async (req: Request, res: Response) => {
  const { wagonId, row, column } = req.body;
  const dataWagon = await getWagonByIdService(req.body.wagonId);
  if (!dataWagon) {
    return errorResponse(res, "Wagon is doesn't exist", 400);
  }
  const result = await createSeatService({
    wagonId,
    seatNumber: `${dataWagon.wagonCode}-${column}${row}`,
    seatAvailability: 'AVAILABLE',
    row,
    column,
  });

  successResponse(res, 'Seat berhasil dibuat', result);
};

export const createBatchSeat = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return errorResponse(res, 'Tidak ada file terupload', 400);
  }
  const seatData = parseExcelFile<{
    wagonId: string;
    row: string;
    column: string;
  }>({
    filePath: file.path,
  });
  const finalSeatData = [];
  for (const data of seatData) {
    let { wagonId, column, row } = data;
    if (!wagonId) continue;

    const wagonData = await getWagonByIdService(wagonId);

    if (!wagonData) {
      return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
    }
    const seatNumber = `${wagonData.wagonCode}-${column}-${row}`;
    const rowNew = parseInt(row, 10);

    finalSeatData.push({
      wagonId,
      column,
      seatNumber,
      seatAvailability: SeatAvailabilityStatus.AVAILABLE,
      row: rowNew,
    });
  }
  const result = await createBatchSeatsService(finalSeatData);
  return successResponse(res, 'Seat berhasil dibuat', result);
};

export const deleteSeat = async (req: Request, res: Response) => {
  const result = await deleteSeatService(req.params.id);
  if (!result) {
    return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
  }
  successResponse(res, 'Seat berhasil dihapus', null);
};

export const getAllSeatsByWagon = async (req: Request, res: Response) => {
  const result = await getAllSeatsServiceByWagon(req.params.wagonId);
  if (!result) {
    return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 400);
  }
  successResponse(res, 'Berhasil mengambil detail seat pada wagon', result);
};
