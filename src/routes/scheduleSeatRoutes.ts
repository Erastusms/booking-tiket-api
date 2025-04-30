import { Router } from 'express';
import {
  createBatchScheduleSeat,
  createScheduleSeat,
  getScheduleSeatsBySchedule,
  updateScheduleSeat,
} from '../controllers/scheduleSeatController';
import { accessRole, auth } from '../middlewares/auth';
import { ROLE } from '../constants';
import { validateRequest } from '../middlewares/validateRequest';
import { createScheduleSeatSchema } from '../validations/scheduleSeatValidation';
import { updateScheduleSchema } from '../validations/scheduleValidation';
import { upload } from '../middlewares/multer';

const scheduleSeatRouter = Router();

scheduleSeatRouter.post(
  '/',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(createScheduleSeatSchema),
  createScheduleSeat
);
scheduleSeatRouter.get('/schedule/:scheduleId', getScheduleSeatsBySchedule);
scheduleSeatRouter.post(
  '/batch',
  auth,
  accessRole(ROLE.ADMIN),
  upload.single('file'),
  createBatchScheduleSeat
);
scheduleSeatRouter.patch(
  '/:id',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(updateScheduleSchema),
  updateScheduleSeat
);

export default scheduleSeatRouter;
