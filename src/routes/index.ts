import express from 'express';
import authRoute from './authRoutes';
import scheduleRoute from './scheduleRoutes';
import trainRoute from './trainRoutes';
import stationRoute from './stationRoutes';
import wagonRoute from './wagonRoute';
import seatRoute from './seatRoutes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/station', stationRoute);
router.use('/train', trainRoute);
router.use('/wagon', wagonRoute);
router.use('/seat', seatRoute);
router.use('/schedule', scheduleRoute);

export default router;
