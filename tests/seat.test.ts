import request from 'supertest';
import path from 'path';
import prisma from '../src/config/prisma';
import app from '../src/app';

describe('Seat API', () => {
  let wagonId: string;

  beforeAll(async () => {
    // Buat 1 wagon dulu buat relasi
    const wagon = await prisma.wagon.create({
      data: {
        trainId: '',
        wagonCode: 'WA1',
        categoryId: (
          await prisma.wagonCategory.create({
            data: {
              name: 'EKONOMI',
              capacity: 500
            },
          })
        ).id,
      },
    });
    wagonId = wagon.id;
  });

  afterAll(async () => {
    // Bersihkan database
    await prisma.seat.deleteMany();
    await prisma.wagon.deleteMany();
    await prisma.wagonCategory.deleteMany();
    await prisma.$disconnect();
  });

  describe('Create Seat Manual', () => {
    it('should create a seat manually', async () => {
      const res = await request(app).post('/api/v1/seat').send({
        wagonId,
        seatNumber: 'A1',
        seatAvailability: 'AVAILABLE',
        row: 1,
        column: 'A',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.seatNumber).toBe('A1');
    });
  });

  describe('Create Seats from Excel', () => {
    it('should create multiple seats from an Excel file', async () => {
      const res = await request(app)
        .post('/api/v1/seat')
        .attach('file', path.join(__dirname, 'files', 'seat.xlsx')); // file excel dummy

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.count).toBeGreaterThan(0);
    });
  });
});
