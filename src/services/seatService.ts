import { PrismaClient, SeatAvailabilityStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateSeatInput {
  wagonId: string;
  seatNumber: string;
  seatAvailability: SeatAvailabilityStatus;
  row: number;
  column: string;
}

export const createSeatService = async (data: CreateSeatInput) => {
  return await prisma.seat.create({ data });
};

export const createSeatsFromExcelService = async (data: CreateSeatInput[]) => {
  return await prisma.seat.createMany({ data, skipDuplicates: true });
};

export const deleteSeatService = async (id: string) => {
  return prisma.seat.delete({ where: { id } });
};

export const getAllSeatsServiceByWagon = async (wagonId: string) => {
  return prisma.seat.findMany({
    where: { wagonId },
    orderBy: [{ row: 'asc' }, { column: 'asc' }],
  });
};
