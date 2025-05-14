import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPayment,
  getMyPayments,
  handleMidtransCallback,
} from '../controllers/paymentController';
import { createPaymentSchema } from '../validations/paymentValidation';

const paymentRoute = Router();

paymentRoute.post('/', auth, validateRequest(createPaymentSchema), createPayment);
paymentRoute.get('/my', auth, getMyPayments);
paymentRoute.post('/callback', handleMidtransCallback);

export default paymentRoute;
