import { Request, Response } from 'express';
import { registerUser } from '../services/authService';
import { successResponse } from '../utils/responseHandler';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  successResponse(res, 'Registrasi berhasil', user);
};
