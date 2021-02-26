import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';

import createConnection from '../database';

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it('should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Example survey',
      description: 'This is a test survey',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should able to get all the surveys', async () => {
    await request(app).post('/surveys').send({
      title: 'Example survey 02',
      description: 'This is a test survey 02',
    });

    const response = await request(app).get('/surveys');

    expect(response.body).toHaveLength(2);
  });
});
