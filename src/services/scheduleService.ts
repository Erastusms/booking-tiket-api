import prisma from '../config/prisma';
import { Schedule } from '@prisma/client';

export const createScheduleService = async (data: Schedule) => {
  return await prisma.schedule.create({ data });
};
