import { Role } from '@prisma/client';
import prisma from '../config/prisma';
import { MESSAGE } from '../constants';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export const registerService = async (
  username: string,
  fullname: string,
  email: string,
  password: string,
  role: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { message: MESSAGE.EMAIL_ALREADY_EXIST };
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      username,
      fullname,
      email,
      passwordHash: hashedPassword,
      role: role as Role,
    },
  });

  return { id: newUser.id, email: newUser.email };
};

export const loginService = async (email: string, password: string) => {
  const result = await prisma.user.findUnique({ where: { email } });
  if (!result) {
    return { message: MESSAGE.USER_NOT_FOUND };
  }
  const token = generateToken(result);
  const { id, username, role } = result;

  await prisma.user.update({ where: { id }, data: { token } });

  const isMatch = await verifyPassword(password, result.passwordHash);
  if (!isMatch) {
    return { message: MESSAGE.LOGIN_FAILED };
  }

  return { id, username, email, role, token };
};
