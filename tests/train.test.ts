import request from 'supertest';
import app from '../src/app';
import { tokenAdmin } from './setup';

let createdTrainId: string;

describe('Train CRUD', () => {
  it('should create a new train', async () => {
    const res = await request(app)
      .post('/api/v1/train')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Argo Bromo',
        code: 'ABR',
        capacity: 100,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Argo Bromo');
    createdTrainId = res.body.data.id;
  });

  it('should get all trains', async () => {
    const res = await request(app)
      .get('/api/v1/train')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should update the train', async () => {
    const res = await request(app)
      .put(`/api/v1/train/${createdTrainId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Argo Bromo Update',
        code: 'ABU',
        capacity: 390,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Argo Bromo Update');
  });

  it('should delete the train', async () => {
    const res = await request(app)
      .delete(`/api/v1/train/${createdTrainId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('berhasil');
  });
});
