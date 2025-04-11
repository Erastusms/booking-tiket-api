import prisma from '../config/prisma';

export const getAllTrainsService = () => prisma.train.findMany();

export const getTrainByIdService = (id: string) =>
  prisma.train.findUniqueOrThrow({ where: { id } });

export const createTrainService = (data: { name: string; code: string; capacity: number }) => {
  return prisma.train.create({ data });
};

export const updateTrainService = (
  id: string,
  data: { name?: string; code?: string; capacity?: number }
) => {
  return prisma.train.update({
    where: { id },
    data,
  });
};

export const removeTrainService = (id: string) => {
  return prisma.train.delete({ where: { id } });
};
