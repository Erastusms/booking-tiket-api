import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import { hashPassword } from '../src/utils/bcrypt';

let tokenAdmin: string;
let tokenUser: string;

beforeAll(async () => {
  await prisma.user.create({
    data: {
      fullname: 'Admin Fullname',
      username: 'Admin Test',
      email: 'admin@example.com',
      passwordHash: await hashPassword('data123'),
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      fullname: 'User Fullname',
      username: 'User Test',
      email: 'user@example.com',
      passwordHash: await hashPassword('data123'),
    },
  });

  const res = await request(app).post('/api/v1/auth/login').send({
    email: 'admin@example.com',
    password: 'data123',
  });

  const resUser = await request(app).post('/api/v1/auth/login').send({
    email: 'user@example.com',
    password: 'data123',
  });

  tokenAdmin = res.body.data.token;
  tokenUser = resUser.body.data.token;
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.$disconnect();
});

export { tokenAdmin, tokenUser };
