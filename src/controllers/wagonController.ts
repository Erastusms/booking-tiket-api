import { Request, Response } from "express";
import { successResponse } from "../utils/responseHandler";
import { createCategoryService, createWagonService, deleteCategoryService, deleteWagonService, getAllCategoryService } from "../services/wagonService";

// Wagon
export const createWagon = async (req: Request, res: Response) => {
    const data = await createWagonService(req.body);
    successResponse(res, 'Wagon berhasil dibuat', data);
};

export const deleteWagon = async (req: Request, res: Response) => {
    await deleteWagonService(req.params.id);
    successResponse(res, 'Wagon berhasil dihapus', null);
};

// Wagon_Category
export const getAllCategory = async (_: Request, res: Response) => {
    const data = await getAllCategoryService();
    successResponse(res, 'Berhasil mengambil semua data Wagon Category', data);
};

export const createCategory = async (req: Request, res: Response) => {
    const data = await createCategoryService(req.body);
    successResponse(res, 'Wagon Category berhasil dibuat', data);
};

export const deleteCategory = async (req: Request, res: Response) => {
    await deleteCategoryService(req.params.id);
    successResponse(res, 'Wagon Category berhasil dihapus', null);
};