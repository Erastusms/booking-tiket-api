import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

let tokenAdmin: string;
let tokenUser: string;

beforeAll(async () => {
  await request(app).post('/api/v1/auth/register').send({
    username: 'Usertest',
    fullname: 'User Fullname',
    email: 'user123@example.com',
    password: 'data123',
  });

  await request(app).post('/api/v1/auth/register').send({
    username: 'Admintest',
    fullname: 'Admin Fullname',
    email: 'admin123@example.com',
    password: 'data123',
    role: 'ADMIN',
  });

  const res = await request(app).post('/api/v1/auth/login').send({
    email: 'admin123@example.com',
    password: 'data123',
  });

  const resUser = await request(app).post('/api/v1/auth/login').send({
    email: 'user123@example.com',
    password: 'data123',
  });
  
  tokenAdmin = res.body.data.user.token;
  tokenUser = resUser.body.data.user.token;
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.$disconnect();
});

export { tokenAdmin, tokenUser };
