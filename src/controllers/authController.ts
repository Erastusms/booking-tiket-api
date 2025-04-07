import { Request, Response } from 'express';
import { loginService, registerUser } from '../services/authService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { MESSAGE } from '../constants';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  if (!user) {
    return errorResponse(res, 'Email is already registered', 400);
  }

  return successResponse(res, 'Registrasi berhasil', user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);

  if (result.message) {
    return errorResponse(res, result.message, 400);
  }

  return successResponse(res, MESSAGE.LOGIN_SUCCESS, result);
};
