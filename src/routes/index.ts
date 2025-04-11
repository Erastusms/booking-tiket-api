import express from 'express';
import authRoute from './authRoutes';
import scheduleRoute from './scheduleRoutes';
import trainRoute from './trainRoutes';
import stationRoute from './stationRoutes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/train', trainRoute);
router.use('/station', stationRoute);
router.use('/schedule', scheduleRoute);

export default router;
