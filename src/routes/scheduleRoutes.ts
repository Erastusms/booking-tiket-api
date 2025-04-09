import express from 'express';

import { ROLE } from '../constants';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { scheduleSchema } from '../validations/scheduleValidation';
import {
  createSchedule,
  uploadScheduleExcel,
} from '../controllers/scheduleController';
import { upload } from '../middlewares/upload';

const scheduleRoute = express.Router();

scheduleRoute.post(
  '/',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(scheduleSchema),
  createSchedule
);

scheduleRoute.post(
  '/upload',
  auth,
  accessRole(ROLE.ADMIN),
  upload.single('file'),
  uploadScheduleExcel
);

export default scheduleRoute;
