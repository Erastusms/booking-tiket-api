import express from 'express';

import { ROLE } from '../constants';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { createScheduleSchema, updateScheduleSchema } from '../validations/scheduleValidation';
import {
  createSchedule,
  getScheduleDetail,
  getSchedules,
  removeSchedule,
  updateSchedule,
  // uploadScheduleExcel,
} from '../controllers/scheduleController';
// import { upload } from '../middlewares/upload';

const scheduleRoute = express.Router();

scheduleRoute.get('/', auth, getSchedules);
scheduleRoute.post(
  '/',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(createScheduleSchema),
  createSchedule
);
scheduleRoute.get('/:id', auth, getScheduleDetail);
scheduleRoute.patch(
  '/:id',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(updateScheduleSchema),
  updateSchedule
);
scheduleRoute.delete('/:id', auth, accessRole(ROLE.ADMIN), removeSchedule);

// scheduleRoute.post(
//   '/upload',
//   auth,
//   accessRole(ROLE.ADMIN),
//   upload.single('file'),
//   uploadScheduleExcel
// );

export default scheduleRoute;
