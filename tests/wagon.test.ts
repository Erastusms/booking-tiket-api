import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

let wagonCategoryId: string;
let trainId: string;
let wagonId: string;

describe('WagonCategory and Wagon API', () => {
  beforeAll(async () => {
    // Buat dummy train karena wagon butuh relasi train
    const train = await prisma.train.create({
      data: {
        name: 'Train Uji',
        code: 'TRU',
      },
    });
    trainId = train.id;
  });

  afterAll(async () => {
    // Bersihkan data setelah test
    await prisma.wagon.deleteMany();
    await prisma.wagonCategory.deleteMany();
    await prisma.train.deleteMany();
    await prisma.$disconnect();
  });

  // ========== WagonCategory ==========
  it('should create a wagon category', async () => {
    const res = await request(app).post('/api/v1/wagon-category').send({
      name: 'EKONOMI',
      capacity: 80,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    wagonCategoryId = res.body.id;
  });

  it('should get all wagon categories', async () => {
    const res = await request(app).get('/api/v1/wagon-category');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete a wagon category', async () => {
    const res = await request(app).delete(`/api/v1/wagon-category/${wagonCategoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Wagon category deleted');
  });

  // ========== Wagon ==========
  it('should create a wagon', async () => {
    // Buat ulang category karena sebelumnya sudah dihapus
    const newCategory = await prisma.wagonCategory.create({
      data: {
        name: 'BISNIS',
        capacity: 60,
      },
    });
    wagonCategoryId = newCategory.id;

    const res = await request(app).post('/api/v1/wagon').send({
      trainId,
      wagonCode: 'WGN1',
      categoryId: wagonCategoryId,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    wagonId = res.body.id;
  });

  it('should delete a wagon', async () => {
    const res = await request(app).delete(`/api/v1/wagon/${wagonId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Wagon deleted');
  });
});
