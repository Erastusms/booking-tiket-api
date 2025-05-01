import { BookingStatus } from '@prisma/client';

export interface CreateBookingInput {
  scheduleId: string;
  seatId: string;
  userId: string;
  passengerName: string;
  totalPassenger: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
