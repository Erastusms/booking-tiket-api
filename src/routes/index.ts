import express from 'express';
import authRoute from './authRoutes';
import scheduleRoute from './scheduleRoutes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/schedule', scheduleRoute);

export default router;
