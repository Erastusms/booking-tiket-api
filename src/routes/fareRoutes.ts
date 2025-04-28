import { Router } from 'express';
import { accessRole, auth } from '../middlewares/auth';
import { ROLE } from '../constants';
import { validateRequest } from '../middlewares/validateRequest';
import { createFareSchema, updateFareSchema } from '../validations/fareValidation';
import {
  createFare,
  getAllFares,
  getFareByCategory,
  updateFare,
} from '../controllers/fareController';

const fareRoute = Router();

fareRoute.post('/', auth, accessRole(ROLE.ADMIN), validateRequest(createFareSchema), createFare);
fareRoute.get('/', getAllFares);
fareRoute.get('/:categoryId', getFareByCategory);
fareRoute.put('/:id', auth, accessRole(ROLE.ADMIN), validateRequest(updateFareSchema), updateFare);

export default fareRoute;
