import { Request, Response } from 'express';
import { successResponse } from '../utils/responseHandler';
import {
  createStationService,
  deleteStationService,
  getAllStationServices,
  getStationServiceById,
  updateStationService,
} from '../services/stationService';

export const createStation = async (req: Request, res: Response) => {
  const station = await createStationService(req.body);
  successResponse(res, 'Stasiun berhasil dibuat', station);
};

export const getAllStations = async (_req: Request, res: Response) => {
  const stations = await getAllStationServices();
  successResponse(res, 'Daftar stasiun berhasil diambil', stations);
};

export const getByIdStation = async (req: Request, res: Response) => {
  const station = await getStationServiceById(req.params.id);
  successResponse(res, 'Detail stasiun berhasil diambil', station);
};

export const updateStation = async (req: Request, res: Response) => {
  const station = await updateStationService(req.params.id, req.body);
  successResponse(res, 'Stasiun berhasil diubah', station);
};

export const removeStation = async (req: Request, res: Response) => {
  await deleteStationService(req.params.id);
  successResponse(res, 'Stasiun berhasil dihapus', null);
};
