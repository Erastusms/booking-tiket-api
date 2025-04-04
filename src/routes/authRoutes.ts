import express from 'express';
import { register } from '../controllers/authController';
import { registerSchema } from '../validations/authValidation';
import { validateRequest } from '../middlewares/validateRequest';

const authRoute = express.Router();

authRoute.post('/register', validateRequest(registerSchema), register);
export default authRoute;
