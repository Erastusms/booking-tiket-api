import prisma from '../config/prisma';
import { Schedule } from '@prisma/client';
import * as XLSX from 'xlsx';
import { buffer } from 'stream/consumers';

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
