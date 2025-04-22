import request from 'supertest'
import app from '../src/app'

describe('Station CRUD API', () => {
    let stationId: string

    it('should create a new station', async () => {
        const res = await request(app).post('/api/v1/station').send({
            name: 'Stasiun Bandung',
            code: 'BDG',
            city: 'Bandung',
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveProperty('id')
        expect(res.body.data.name).toBe('Stasiun Bandung')
        stationId = res.body.id
    })

    it('should get all stations', async () => {
        const res = await request(app).get('/api/v1/station')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('should get one station by id', async () => {
        const res = await request(app).get(`/api/v1/station/${stationId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveProperty('id', stationId)
    })

    it('should update a station', async () => {
        const res = await request(app).put(`/api/v1/station/${stationId}`).send({
            name: 'Stasiun Bandung Updated',
            code: 'BDGU',
            city: 'Bandung',
        })
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('Stasiun Bandung Updated')
    })

    it('should delete a station', async () => {
        const res = await request(app).delete(`/api/v1/station/${stationId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message', 'Station deleted successfully')
    })
})
