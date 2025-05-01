import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../utils/responseHandler';
import { isPrismaError } from '../helpers/isPrismaError';

export const isErrorResponse = (obj: any): obj is { message: string } => {
  return typeof obj === 'object' && obj !== null && 'message' in obj;
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Prisma error (any type)
  if (isPrismaError(err)) {
    let message = 'Terjadi kesalahan pada database';
    let status = 400;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        message = `Data sudah ada: ${err.meta?.target}`;
      }
      if (err.code === 'P2003') {
        message = `Data relasi tidak ditemukan: ${err.meta?.field_name}`;
      }
      if (err.code === 'P2025') {
        message = `Data tidak ditemukan`;
      }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
      console.log(err.message);
      message = 'Query Prisma tidak valid';
    }

    errorResponse(res, message, status);
  } else {
    errorResponse(res, err.message || 'Internal Server Error', err.status || 500);
  }
};
