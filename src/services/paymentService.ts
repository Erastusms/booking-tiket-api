import axios from 'axios';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { PaymentStatus } from '@prisma/client';
import { camelToSnake } from '../helpers/camelToSnake';
const { MIDTRANS_SERVER_KEY, MIDTRANS_GET_VA } = process.env;

export const createPaymentService = async (bookingId: string, userId: string, method: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true },
  });

  if (!booking) return { message: 'Booking tidak ditemukan' };
  if (booking.userId !== userId) return { message: 'Tidak diizinkan' };

  const amount = 50000; // contoh: bisa dari harga tiket

  // Simpan payment ke DB
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount,
      status: 'PENDING',
      paymentMethod: method,
      paymentDate: new Date(),
    },
  });

  const requestBodyToMidtrans = {
    payment_type: method,
    bank_transfer: {
      bank: 'bca',
    },
    transaction_details: {
      order_id: payment.id,
      gross_amount: amount,
    },
    customer_details: {
      first_name: booking.passengerName,
      email: booking.user.email,
    },
  };

  const requestHeaders = {
    headers: {
      Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
  };

  // Buat transaksi ke Midtrans
  const response = await axios.post(MIDTRANS_GET_VA || '', requestBodyToMidtrans, requestHeaders);

  return response.data;
};

export const getMyPaymentsService = async (userId: string) => {
  return await prisma.payment.findMany({
    where: {
      booking: {
        userId,
      },
    },
    include: {
      booking: true,
      logs: true,
    },
    orderBy: {
      paymentDate: 'desc',
    },
  });
};

export const handleMidtransCallbackService = async (body: any) => {
  const { orderId, transactionStatus, grossAmount, signatureKey } = body;

  const expectedSignature = crypto
    .createHash('sha512')
    .update(orderId + grossAmount + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex');

  if (signatureKey !== expectedSignature) {
    return { message: 'Invalid signature', statusCode: 403 };
  }

  const newStatus: PaymentStatus =
    transactionStatus === 'settlement' || transactionStatus === 'capture'
      ? 'SUCCESS'
      : transactionStatus === 'cancel' || transactionStatus === 'expire'
        ? 'FAILED'
        : 'PENDING';

  const payment = await prisma.payment.findUnique({
    where: { id: orderId },
  });

  if (!payment) {
    return { message: 'Payment tidak ditemukan', statusCode: 404 };
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: orderId },
      data: { status: newStatus },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: newStatus === 'SUCCESS' ? 'PAID' : 'CANCELLED',
      },
    }),
    prisma.paymentLog.create({
      data: {
        paymentId: orderId,
        status: newStatus,
        message: 'CREATED',
        // rawData: camelToSnake(body),
      },
    }),
  ]);

  return { success: true };
};
