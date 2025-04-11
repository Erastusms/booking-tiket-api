import { Router } from 'express';
import { createTrain, getTrainById, getTrains, removeTrain, updateTrain } from '../controllers/trainController';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { createTrainSchema, updateTrainSchema } from '../validations/trainValidation';
import { ROLE } from '../constants';

const trainRoute = Router();

trainRoute.get('/', getTrains);
trainRoute.get('/:id', getTrainById);
trainRoute.post('/', auth, accessRole(ROLE.ADMIN), validateRequest(createTrainSchema), createTrain);
trainRoute.put('/:id', auth, accessRole(ROLE.ADMIN), validateRequest(updateTrainSchema), updateTrain);
trainRoute.delete('/:id', auth, accessRole(ROLE.ADMIN), removeTrain);

export default trainRoute;
