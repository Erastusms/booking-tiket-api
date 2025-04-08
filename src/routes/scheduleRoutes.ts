import express from 'express';

import { ROLE } from '../constants';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { scheduleSchema } from '../validations/scheduleValidation';
import { createSchedule } from '../controllers/scheduleController';

const scheduleRoute = express.Router();

scheduleRoute.post(
  '/',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(scheduleSchema),
  createSchedule
);

export default scheduleRoute;
