import { Request, Response } from 'express';
import {
  createPaymentService,
  getMyPaymentsService,
  handleMidtransCallbackService,
} from '../services/paymentService';
import { errorResponse, successResponse } from '../utils/responseHandler';
import { isErrorResponse } from '../middlewares/errorHandler';

export const createPayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { bookingId, paymentMethod } = req.body;

  const result = await createPaymentService(bookingId, userId || '', paymentMethod);

  if (isErrorResponse(result)) {
    return errorResponse(res, result.message, 400);
  }

  return successResponse(res, 'Payment berhasil dibuat', result);
};

export const getMyPayments = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await getMyPaymentsService(userId || '');
  return successResponse(res, 'Daftar pembayaran berhasil diambil', result);
};

export const handleMidtransCallback = async (req: Request, res: Response) => {
  const result = await handleMidtransCallbackService(req.body);
  if (isErrorResponse(result)) {
    return errorResponse(res, result.message, 400);
  }
  return successResponse(res, 'Webhook processed', result);
};
