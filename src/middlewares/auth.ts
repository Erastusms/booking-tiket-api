import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseHandler';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Unauthorized. Token tidak ditemukan', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Token tidak valid', 401);
  }
};

export const accessRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role.toLowerCase() !== role) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang diperbolehkan.',
      });
    }
    next();
  };
};
