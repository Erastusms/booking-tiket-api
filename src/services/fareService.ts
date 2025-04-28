import prisma from '../config/prisma';
import { CreateFareSchemaType } from '../validations/fareValidation';

export const createFareService = async (data: CreateFareSchemaType) => {
  return prisma.fare.create({ data });
};

export const getAllFaresService = async () => {
  return prisma.fare.findMany({
    include: {
      schedule: true,
      category: true,
    },
  });
};

export const getFareByCategoryService = async (categoryId: string) => {
  console.log(categoryId);
  return await prisma.fare.findMany({
    where: {
      categoryId,
    },
    include: {
      schedule: true,
      category: true,
    },
  });
};

export const updateFareService = async (id: string, data: Partial<CreateFareSchemaType>) => {
  return prisma.fare.update({
    where: { id },
    data,
  });
};
