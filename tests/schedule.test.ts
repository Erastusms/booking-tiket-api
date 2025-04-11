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
        trainId: '015727e1-15f3-4dd1-8ea0-cfcac9eebcad',
        departureStationId: '1d48c5a3-a8b0-478b-b527-02c2ba33fc5f',
        arrivalStationId: '377c5e4a-2f99-4369-afeb-54b023955b36',
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
