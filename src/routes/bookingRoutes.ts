import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getMyBookings,
} from '../controllers/bookingController';
import { createBookingSchema } from '../validations/bookingValidation';

const bookingRoute = Router();

bookingRoute.post('/', auth, validateRequest(createBookingSchema), createBooking);
bookingRoute.get('/me', auth, getMyBookings);
bookingRoute.get('/:id', auth, getBookingById);
bookingRoute.delete('/:id', auth, deleteBooking);

export default bookingRoute;
