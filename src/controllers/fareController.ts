import { Request, Response } from 'express';
import { createFareService, getAllFaresService, getFareByCategoryService, updateFareService } from '../services/fareService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { MESSAGE } from '../constants';

export const createFare = async (req: Request, res: Response) => {
  const fare = await createFareService(req.body);
  return successResponse(res, 'Fare berhasil dibuat', fare);
};

export const getAllFares = async (req: Request, res: Response) => {
  const fares = await getAllFaresService();
  return successResponse(res, 'Menampilkan data Fare', fares);
};

export const getFareByCategory = async (req: Request, res: Response) => {
  const fares = await getFareByCategoryService(req.params.categoryId);
  if (!fares) {
    return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
  }
  return successResponse(res, 'Mendapatkan Fare sesuai category', fares);
};

export const updateFare = async (req: Request, res: Response) => {
  const fare = await updateFareService(req.params.id, req.body);
  return successResponse(res, 'Fare berhasil diperbarui', fare);
};
