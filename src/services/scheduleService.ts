import prisma from '../config/prisma';
import { Schedule } from '@prisma/client';
import * as XLSX from 'xlsx';
import { buffer } from 'stream/consumers';

interface ScheduleFilter {
  from?: string;
  to?: string;
  date?: string;
}

export const createScheduleService = async (data: Schedule) => {
  return await prisma.schedule.create({ data });
};

export const createSchedulesFromExcel = async (
  fileBuffer: Buffer
): Promise<Schedule[]> => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const createdSchedules: Schedule[] = [];

  for (const item of jsonData as any[]) {
    const schedule = await prisma.schedule.create({
      data: {
        trainId: item.trainId,
        departureStationId: item.departureStationId,
        arrivalStationId: item.arrivalStationId,
        departureTime: new Date(item.departureTime),
        arrivalTime: new Date(item.arrivalTime),
        price: item.price,
      },
    });
    createdSchedules.push(schedule);
  }

  return createdSchedules;
};

export const getScheduleService = async (filter: ScheduleFilter) => {
  const { from, to, date } = filter;

  return await prisma.schedule.findMany({
    where: {
      ...(from && {
        departureStation: { name: { contains: from, mode: 'insensitive' } },
      }),
      ...(to && {
        arrivalStation: { name: { contains: to, mode: 'insensitive' } },
      }),
      ...(date && {
        departureTime: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        },
      }),
    },
    include: {
      train: true,
      departureStation: true,
      arrivalStation: true,
    },
    orderBy: { departureTime: 'asc' },
  });
};
