import { Router } from 'express';
import { createTrain, getTrainById, getTrains, removeTrain, updateTrain } from '../controllers/trainController';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { createTrainSchema, updateTrainSchema } from '../validations/trainValidation';
import { ROLE } from '../constants';
import { createWagonCategorySchema, createWagonSchema } from '../validations/wagonValidation';
import { createCategory, createWagon, deleteCategory, deleteWagon, getAllCategory } from '../controllers/wagonController';

const wagonRoute = Router();

wagonRoute.post('/', auth, accessRole(ROLE.ADMIN), validateRequest(createWagonSchema), createWagon);
wagonRoute.delete('/:id', auth, accessRole(ROLE.ADMIN), deleteWagon);

wagonRoute.get('/category', auth, accessRole(ROLE.ADMIN), getAllCategory);
wagonRoute.post('/category', auth, accessRole(ROLE.ADMIN), validateRequest(createWagonCategorySchema), createCategory);
wagonRoute.delete('/category/:id', auth, accessRole(ROLE.ADMIN), deleteCategory);


export default wagonRoute;
