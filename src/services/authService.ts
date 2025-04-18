import prisma from '../config/prisma';
import { MESSAGE } from '../constants';
import { hashPassword, verifyPassword } from '../utils/bcrypt';

export const registerService = async (data: any) => {
  const { email, password, ...res } = data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { message: MESSAGE.EMAIL_ALREADY_EXIST };
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      ...res,
    },
  });

  return { id: newUser.id, email: newUser.email };
};

export const loginService = async (email: string, password: string) => {
  const result = await prisma.user.findUnique({ where: { email } });
  if (!result) {
    return { message: MESSAGE.USER_NOT_FOUND };
  }

  const { id, fullName, role, password: hashedPassword } = result;
  const isMatch = await verifyPassword(password, hashedPassword);
  if (!isMatch) {
    return { message: MESSAGE.LOGIN_FAILED };
  }

  return { id, fullName, role };
};
