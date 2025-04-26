import { Router } from 'express';
import { accessRole, auth } from '../middlewares/auth';
import { ROLE } from '../constants';
import { validateRequest } from '../middlewares/validateRequest';
import { createSeatSchema } from '../validations/seatValidation';
import { createSeat, createSeatUpload, deleteSeat, getAllSeatsByWagon } from '../controllers/seatController';
import { upload } from '../middlewares/multer';

const seatRoute = Router();

seatRoute.post('/', auth, accessRole(ROLE.ADMIN), validateRequest(createSeatSchema), createSeat);
seatRoute.post('/upload', auth, accessRole(ROLE.ADMIN), upload.single('file'), createSeatUpload);
seatRoute.delete('/:id', auth, accessRole(ROLE.ADMIN), deleteSeat);
seatRoute.get('/wagon/:wagonId', getAllSeatsByWagon);

export default seatRoute;
