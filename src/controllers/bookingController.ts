import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/responseHandler';
import {
  createBookingService,
  deleteBookingService,
  getBookingByIdService,
  getMyBookingsService,
} from '../services/bookingService';
import { MESSAGE } from '../constants';
import { AuthorizationHelper } from '../utils/authHelper';
import { isErrorResponse } from '../middlewares/errorHandler';

export const createBooking = async (req: Request, res: Response) => {
  const createBookingParam = {
    ...req.body,
    userId: req.user?.id,
  };
  const booking = await createBookingService(createBookingParam);
  if (isErrorResponse(booking)) {
    return errorResponse(res, booking.message, 400);
  }
  return successResponse(res, 'Booking berhasil dibuat', booking);
};

export const getMyBookings = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return errorResponse(res, MESSAGE.USER_NOT_FOUND, 401);
  }
  const bookings = await getMyBookingsService(userId);
  return successResponse(res, 'Daftar booking berhasil diambil', bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return errorResponse(res, MESSAGE.USER_NOT_FOUND, 401);
  }
  const booking = await getBookingByIdService(req.params.id, userId);
  if (!booking) return errorResponse(res, 'Booking tidak ditemukan', 404);
  return successResponse(res, 'Detail booking berhasil diambil', booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    return errorResponse(res, MESSAGE.USER_NOT_FOUND, 401);
  }

  const booking = await getBookingByIdService(bookingId, userId);
  if (!booking) {
    return errorResponse(res, 'Booking tidak ditemukan', 404);
  }

  const authError = await AuthorizationHelper.isOwner(userId, booking.userId, res);
  if (authError) return authError;

  const deleted = await deleteBookingService(req.params.id, userId);
  if (!deleted) return errorResponse(res, MESSAGE.DATA_NOT_FOUND, 404);
  return successResponse(res, 'Booking berhasil dibatalkan', null);
};
