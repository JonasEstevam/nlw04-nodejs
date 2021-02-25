import request from 'supertest';
import app from '../app';

import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: 'user01@example.com',
      name: 'User Example',
    });

    expect(response.status).toBe(201);
  });

  it('sould not be able a user with an existing email', async () => {
    const response = await request(app).post('/users').send({
      email: 'user01@example.com',
      name: 'User Example',
    });
    expect(response.status).toBe(400);
  });
});
