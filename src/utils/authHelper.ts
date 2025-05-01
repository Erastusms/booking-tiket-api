import { Response } from 'express';
import { errorResponse } from './responseHandler';

export class AuthorizationHelper {
  static async isOwner(
    userId: string | undefined,
    ownerId: string,
    res: Response,
    message: string = 'Kamu tidak memiliki izin untuk mengakses data ini'
  ) {
    if (!userId) {
      return errorResponse(res, 'User tidak terautentikasi', 401);
    }

    if (userId !== ownerId) {
      return errorResponse(res, message, 403);
    }

    return null;
  }
}
