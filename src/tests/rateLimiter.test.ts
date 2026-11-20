import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';
import { authLimiter } from '../middleware/rateLimiter.js';
import { logger } from '../utils/logger.js';

const app = express();
app.use(express.json());
app.post('/login', authLimiter, (_req, res) => res.status(401).json({ message: 'Credenciales inválidas' }));

describe('Límite de intentos de login', () => {
  it('responde 429 al superar los 5 intentos fallidos y lo deja en el log', async () => {
    const aviso = jest.spyOn(logger, 'warn');

    for (let intento = 1; intento <= 5; intento++) {
      const res = await request(app).post('/login').send({ email: 'a@a.com', password: 'malamala' });
      expect(res.status).toBe(401);
    }

    const res = await request(app).post('/login').send({ email: 'a@a.com', password: 'malamala' });

    expect(res.status).toBe(429);
    expect(res.body.message).toBe('Demasiados intentos de autenticación, intenta de nuevo en 15 minutos');
    expect(res.headers['ratelimit-limit']).toBeDefined();
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining('Límite de peticiones superado'));

    aviso.mockRestore();
  });
});
