import { Request, Response } from 'express';
import { registerUser } from '../services/authService';
import { errorResponse, successResponse } from '../utils/responseHandler';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  if (!user) {
    return errorResponse(res, 'Email is already registered', 400);
  }

  return successResponse(res, 'Registrasi berhasil', user);
};
