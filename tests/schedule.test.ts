import request from 'supertest';
import path from 'path';
import app from '../src/app';
import { tokenAdmin, tokenUser } from './setup';

describe('Schedule - Create', () => {
  it('should allow admin to create schedule', async () => {
    const response = await request(app)
      .post('/api/v1/schedule')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        trainId: '7a455200-7cf6-48f3-8932-e4dbd5c1759b',
        departureStationId: '73f9b1c0-eb55-4157-b02a-92041fab588e',
        arrivalStationId: '7fc860a2-adee-4a6c-b87c-5e3755be1977',
        departureTime: '2025-05-01T08:00:00Z',
        arrivalTime: '2025-05-01T12:00:00Z',
        price: 450000,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should deny access to member', async () => {
    const res = await request(app)
      .post('/api/v1/schedule')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({});

    expect(res.status).toBe(403);
  });

  it('should create multiple schedules from Excel file', async () => {
    const filePath = path.resolve(__dirname, "../public/template/schedule.xlsx");

    const response = await request(app)
      .post('/api/v1/schedule/upload')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .attach('file', filePath);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
