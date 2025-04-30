import prisma from "../config/prisma";
import { CreateBatchScheduleSeatInput, CreateScheduleSeatInput, UpdateScheduleSeatInput } from "../validations/scheduleSeatValidation";

export const createScheduleSeatService = async (data: CreateScheduleSeatInput) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: data.scheduleId },
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  return prisma.scheduleSeat.create({
    data,
  });
};

export const getScheduleSeatsByScheduleService = async (scheduleId: string) => {
  return prisma.scheduleSeat.findMany({
    where: { scheduleId },
    include: {
      seat: true,
    },
  });
};

export const createBatchScheduleSeatService = async (seats: CreateBatchScheduleSeatInput[]) => {
  return prisma.scheduleSeat.createMany({
    data: seats,
    skipDuplicates: true,
  });
};

export const updateScheduleSeatService = async (id: string, data: UpdateScheduleSeatInput) => {
  return prisma.scheduleSeat.update({
    where: { id },
    data,
  });
};
