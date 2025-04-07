import express from 'express';
import { login, register } from '../controllers/authController';
import { loginSchema, registerSchema } from '../validations/authValidation';
import { validateRequest } from '../middlewares/validateRequest';

const authRoute = express.Router();

authRoute.post('/register', validateRequest(registerSchema), register);
authRoute.post('/login', validateRequest(loginSchema), login);

export default authRoute;
