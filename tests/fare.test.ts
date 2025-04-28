import request from 'supertest';
import app from '../src/app';
describe('Fare API', () => {
  let categoryId: string;
  let scheduleId: string;
  let fareId: string;

  beforeAll(async () => {
    // Persiapkan data yang diperlukan, misalnya kategori dan jadwal kereta

    const category = await request(app)
      .post('/api/v1/wagon-category')
      .send({
        name: 'Economy',
      })
      .expect(201);

    const schedule = await request(app)
      .post('/api/v1/schedule')
      .send({
        trainId: 'train1',
        departureStationId: 'station1',
        arrivalStationId: 'station2',
        departureTime: new Date().toISOString(),
        arrivalTime: new Date().toISOString(),
      })
      .expect(201);

    categoryId = category.body.id;
    scheduleId = schedule.body.id;

    // Membuat fare menggunakan API
    const fareResponse = await request(app)
      .post('/api/v1/fare')
      .send({
        scheduleId,
        categoryId,
        price: 500000,
      })
      .expect(201);

    fareId = fareResponse.body.id; // Simpan ID untuk testing lebih lanjut
  });

  afterAll(async () => {
    // Hapus data yang sudah dibuat
    await request(app).delete(`/api/v1/fare/${fareId}`).expect(200);
    await request(app).delete(`/api/v1/schedule/${scheduleId}`).expect(200);
    await request(app).delete(`/api/v1/wagon-category/${categoryId}`).expect(200);
  });

  test('should create a fare', async () => {
    const response = await request(app)
      .post('/api/v1/fare')
      .send({
        scheduleId,
        categoryId,
        price: 750000,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.price).toBe(750000);
    expect(response.body.scheduleId).toBe(scheduleId);
    expect(response.body.categoryId).toBe(categoryId);
  });

  test('should get all fares', async () => {
    const response = await request(app).get('/api/v1/fare').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should return fares for a specific category name', async () => {
    const categoryName = 'Economy';

    const response = await request(app).get(`/api/v1/fare/category/${categoryName}`).expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0].category.name).toBe(categoryName);
  });

  test('should return an empty array for a non-existent category', async () => {
    const categoryName = 'NonExistentCategory';

    const response = await request(app).get(`/api/v1/fare/category/${categoryName}`).expect(200);

    expect(response.body).toEqual([]);
  });

  test('should delete a fare', async () => {
    // Menghapus fare yang telah dibuat
    const response = await request(app).delete(`/api/v1/fare/${fareId}`).expect(200);

    // Memastikan fare sudah dihapus
    expect(response.body).toHaveProperty('message', 'Fare deleted successfully');

    // Cek kembali apakah fare sudah tidak ada
    await request(app).get(`/api/v1/fare/${fareId}`).expect(404);
  });
});
