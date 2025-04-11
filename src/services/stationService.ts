import prisma from '../config/prisma';

export const createStationService = async (data: {
  name: string;
  code: string;
  location: string;
}) => {
  return await prisma.station.create({ data });
};

export const getAllStationServices = async () => {
  return await prisma.station.findMany();
};

export const getStationServiceById = async (id: string) => {
  return await prisma.station.findUnique({ where: { id } });
};

export const updateStationService = async (
  id: string,
  data: Partial<{ name: string; code: string; location: string }>
) => {
  return await prisma.station.update({ where: { id }, data });
};

export const deleteStationService = async (id: string) => {
  return await prisma.station.delete({ where: { id } });
};
