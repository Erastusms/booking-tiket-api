import { Role } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string(),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  phoneNumber: z.string().min(10),
  idCardNumber: z.string().min(8),
  role: z.nativeEnum(Role).optional().default(Role.MEMBER),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
