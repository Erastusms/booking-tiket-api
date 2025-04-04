import prisma from '../config/prisma';
import { hashPassword } from '../utils/bcrypt';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw { message: 'Email sudah digunakan', status: 400 };
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  return { id: newUser.id, email: newUser.email };
};
