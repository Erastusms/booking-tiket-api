import { Train } from '@prisma/client';
import prisma from '../config/prisma';

export const getAllTrainsService = async (): Promise<Train[]> => {
  return prisma.train.findMany()
}

export const getTrainByIdService = async (id: string): Promise<Train | null> => {
  return await prisma.train.findUnique({ where: { id } });
}

export const createTrainService = async (data: Omit<Train, "id" | "createdAt">): Promise<Train> => {
  return prisma.train.create({ data })
}

export const updateTrainService = async (id: string, data: Partial<Train>): Promise<Train | null> => {
  const result = await prisma.train.findUnique({ where: { id } });
  if (result) {
    return prisma.train.update({ where: { id }, data })
  }
  return result
}

export const removeTrainService = async (id: string): Promise<Train | null> => {
  const result = await prisma.train.findUnique({ where: { id } });
  if (result) {
    return await prisma.train.delete({ where: { id } })
  }
  return result;
}
