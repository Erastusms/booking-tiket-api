import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  paymentMethod: z.enum(['bank_transfer', 'qris']),
});
