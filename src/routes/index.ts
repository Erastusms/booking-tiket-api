import express from 'express';
import authRoute from './authRoutes';
import scheduleRoute from './scheduleRoutes';
import trainRoute from './trainRoutes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/train', trainRoute);
router.use('/schedule', scheduleRoute);

export default router;
