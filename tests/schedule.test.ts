import request from 'supertest';
import path from 'path';
import app from '../src/app';
import { tokenAdmin, tokenUser } from './setup';

describe('Schedule - Create', () => {
  let scheduleId: string;
  it('should allow admin to create schedule', async () => {
    const response = await request(app)
      .post('/api/v1/schedule')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        trainId: '015727e1-15f3-4dd1-8ea0-cfcac9eebcad',
        departureStationId: '1d48c5a3-a8b0-478b-b527-02c2ba33fc5f',
        arrivalStationId: '377c5e4a-2f99-4369-afeb-54b023955b36',
        departureTime: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour later
        arrivalTime: new Date(Date.now() + 7200 * 1000).toISOString(), // 2 hours later
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    scheduleId = response.body.data.id;
  });

  it('should deny access to member', async () => {
    const response = await request(app)
      .post('/api/v1/schedule')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it('should fetch all schedules', async () => {
    const response = await request(app).get('/api/v1/schedule');
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should fetch schedule by ID', async () => {
    const res = await request(app).get(`/api/v1/schedule/${scheduleId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.id).toBe(scheduleId);
  });

  it('should update schedule', async () => {
    const newDepartureTime = new Date(Date.now() + 10800 * 1000).toISOString(); // 3 hours later
    const response = await request(app).patch(`/api/v1/schedule/${scheduleId}`).send({
      departureTime: newDepartureTime,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.data.departureTime).toBe(newDepartureTime);
  });

  it('should delete schedule', async () => {
    const response = await request(app).delete(`/api/v1/schedule/${scheduleId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Schedule deleted successfully');
  });

  it('should return 404 for fetching non-existing schedule', async () => {
    const response = await request(app).get(`/api/v1/schedule/${scheduleId}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toBe('Data not found');
  });

  // it('should create multiple schedules from Excel file', async () => {
  //   const filePath = path.resolve(__dirname, '../public/template/schedule.xlsx');

  //   const response = await request(app)
  //     .post('/api/v1/schedule/upload')
  //     .set('Authorization', `Bearer ${tokenAdmin}`)
  //     .attach('file', filePath);

  //   expect(response.status).toBe(200);
  //   expect(response.body.success).toBe(true);
  //   expect(Array.isArray(response.body.data)).toBe(true);
  // });
});
