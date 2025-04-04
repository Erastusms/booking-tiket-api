import express from 'express';
import authRoute from './authRoutes';

const router = express.Router();

router.use('/auth', authRoute);

export default router;
