import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getMyBookings,
  updateBooking,
} from '../controllers/bookingController';
import { createBookingSchema, updateBookingSchema } from '../validations/bookingValidation';

const bookingRoute = Router();

bookingRoute.post('/', auth, validateRequest(createBookingSchema), createBooking);
bookingRoute.get('/me', auth, getMyBookings);
bookingRoute.get('/:id', auth, getBookingById);
bookingRoute.delete('/:id', auth, deleteBooking);
bookingRoute.patch('/:id', auth, validateRequest(updateBookingSchema), updateBooking);

export default bookingRoute;
