import { Request, Response } from 'express';
import { loginService, registerService } from '../services/authService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { MESSAGE } from '../constants';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerService(name, email, password);
  if (user.message) {
    return errorResponse(res, user.message, 400);
  }

  return successResponse(res, MESSAGE.REGISTER_SUCCESS, user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);

  if (result.message) {
    return errorResponse(res, result.message, 400);
  }

  const token = generateToken(result);

  return successResponse(res, MESSAGE.LOGIN_SUCCESS, { token, user: result });
};
