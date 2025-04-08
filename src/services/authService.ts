import prisma from '../config/prisma';
import { MESSAGE } from '../constants';
import { hashPassword, verifyPassword } from '../utils/bcrypt';

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { message: MESSAGE.EMAIL_ALREADY_EXIST };
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

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: MESSAGE.USER_NOT_FOUND };
  }
  
  const isMatch = await verifyPassword(password, user.passwordHash)
  if (!isMatch) {
    return { message: MESSAGE.LOGIN_FAILED };
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};
