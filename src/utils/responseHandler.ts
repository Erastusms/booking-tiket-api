import { Response } from 'express';

export const successResponse = (res: Response, message: string, data: any) => {
  return res.status(200).json({ success: true, message, data });
};

export const errorResponse = (
  res: Response,
  message: string,
  status: number = 500
) => {
  return res.status(status).json({ success: false, message });
};
