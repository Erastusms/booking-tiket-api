import { Router } from 'express';
import { accessRole, auth } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { ROLE } from '../constants';
import { createStationSchema, updateStationSchema } from '../validations/stationValidation';
import {
  createStation,
  getAllStations,
  getByIdStation,
  removeStation,
  updateStation,
} from '../controllers/stationController';

const stationRoute = Router();

stationRoute.get('/', getAllStations);
stationRoute.get('/:id', getByIdStation);
stationRoute.post(
  '/',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(createStationSchema),
  createStation
);
stationRoute.put(
  '/:id',
  auth,
  accessRole(ROLE.ADMIN),
  validateRequest(updateStationSchema),
  updateStation
);
stationRoute.delete('/:id', auth, accessRole(ROLE.ADMIN), removeStation);

export default stationRoute;
