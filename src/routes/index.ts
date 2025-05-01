import express from 'express';
import authRoute from './authRoutes';
import scheduleRoute from './scheduleRoutes';
import trainRoute from './trainRoutes';
import stationRoute from './stationRoutes';
import wagonRoute from './wagonRoute';
import seatRoute from './seatRoutes';
import fareRoute from './fareRoutes';
import scheduleSeatRouter from './scheduleSeatRoutes';
import bookingRoute from './bookingRoutes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/station', stationRoute);
router.use('/train', trainRoute);
router.use('/wagon', wagonRoute);
router.use('/seat', seatRoute);
router.use('/schedule', scheduleRoute);
router.use('/schedule-seat', scheduleSeatRouter);
router.use('/fare', fareRoute);
router.use('/booking', bookingRoute);

export default router;
