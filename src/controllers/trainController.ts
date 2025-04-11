import { Request, Response } from 'express';
import { successResponse } from '../utils/responseHandler';
import {
  createTrainService,
  getAllTrainsService,
  getTrainByIdService,
  removeTrainService,
  updateTrainService,
} from '../services/trainService';

export const getTrains = async (_req: Request, res: Response) => {
  const result = await getAllTrainsService();
  successResponse(res, 'Berhasil mengambil semua data train', result);
};

export const getTrainById = async (req: Request, res: Response) => {
  const result = await getTrainByIdService(req.params.id);
  successResponse(res, 'Berhasil mengambil detail train', result);
};

export const createTrain = async (req: Request, res: Response) => {
  const result = await createTrainService(req.body);
  successResponse(res, 'Train berhasil dibuat', result);
};

export const updateTrain = async (req: Request, res: Response) => {
  const result = await updateTrainService(req.params.id, req.body);
  successResponse(res, 'Train berhasil diperbarui', result);
};

export const removeTrain = async (req: Request, res: Response) => {
  const result = await removeTrainService(req.params.id);
  successResponse(res, 'Train berhasil dihapus', result);
};
