const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

const testUser = {
  username: 'usuario_prueba_jest',
  password: 'password123'
};

afterAll(async () => {
  await User.deleteOne({ username: testUser.username });
  await mongoose.connection.close();
});

describe('Pruebas de Autenticación', () => {
  it('Debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });

  it('Debería iniciar sesión y devolver un token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});