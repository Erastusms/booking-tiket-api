import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import path from 'path';

let token: string;
let scheduleId: string;
let seatId: string;
let scheduleSeatId: string;

beforeAll(async () => {
  // Login sebagai admin
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: 'admin@example.com',
    password: 'admin123',
  });
  token = loginRes.body.data.token;

  // Ambil satu seat dan schedule untuk testing
  const seat = await prisma.seat.findFirst();
  const schedule = await prisma.schedule.findFirst();

  if (!seat || !schedule) {
    throw new Error('Data seat atau schedule tidak ditemukan');
  }

  seatId = seat.id;
  scheduleId = schedule.id;
});

describe('ScheduleSeat API', () => {
  it('should create a scheduleSeat', async () => {
    const res = await request(app)
      .post('/api/v1/schedule-seat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        seatId,
        scheduleId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    scheduleSeatId = res.body.data.id;
  });

  it('should get scheduleSeats by scheduleId', async () => {
    const res = await request(app)
      .get(`/api/v1/schedule-seat?scheduleId=${scheduleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should update isBooked status of scheduleSeat', async () => {
    const res = await request(app)
      .patch(`/api/v1/schedule-seat/${scheduleSeatId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isBooked: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isBooked).toBe(true);
  });

  it('should return 404 for invalid scheduleId on create', async () => {
    const res = await request(app)
      .post('/api/v1/schedule-seat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        seatId,
        scheduleId: 'invalid-id',
      });

    expect(res.statusCode).toBe(404);
  });
});

describe('ScheduleSeat Excel Upload API', () => {
  it('should create schedule seats in batch from uploaded Excel file', async () => {
    const filePath = path.join(__dirname, '../public/template/seat.xlsx');

    const res = await request(app)
      .post('/api/v1/schedule-seat/batch')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', filePath);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'ScheduleSeat berhasil dibuat');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return error when no file uploaded', async () => {
    const res = await request(app)
      .post('/api/v1/schedule-seat/batch')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Tidak ada file terupload');
  });
});
