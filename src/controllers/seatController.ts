import { Request, Response } from 'express';
import {
  createSeatService,
  createSeatsFromExcelService,
  deleteSeatService,
  getAllSeatsServiceByWagon,
} from '../services/seatService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { MESSAGE } from '../constants';
import { getWagonByIdService } from '../services/wagonService';
import { parseExcelFile } from '../utils/excelHelper';

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

export const createSeatUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return errorResponse(res, 'Tidak ada file terupload', 400);
  }
  const seatsData = parseExcelFile(req.file.path);
  const result = await createSeatsFromExcelService(seatsData);

  successResponse(res, 'Seat berhasil dibuat', result);
};

export const deleteSeat = async (req: Request, res: Response) => {
  const result = await deleteSeatService(req.params.id);
  if (!result) {
    return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 400);
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
