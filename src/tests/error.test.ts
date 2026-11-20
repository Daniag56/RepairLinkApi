import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';
import { errorHandler } from '../middleware/error.js';
import { logger } from '../utils/logger.js';

const app = express();
app.get('/falla', () => {
  throw new Error('Invalid `prisma.user.findUnique()` invocation: tabla User');
});
app.get('/no-existe', () => {
  throw Object.assign(new Error('Recurso no encontrado'), { status: 404 });
});
app.use(errorHandler);

describe('Manejador de errores', () => {
  it('no enseña detalles internos en un 500', async () => {
    const fallo = jest.spyOn(logger, 'error').mockImplementation(() => logger);

    const res = await request(app).get('/falla');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Error interno del servidor' });
    expect(JSON.stringify(res.body)).not.toContain('prisma');
    expect(fallo).toHaveBeenCalledWith(expect.stringContaining('prisma.user.findUnique'));

    fallo.mockRestore();
  });

  it('mantiene el mensaje en los errores 4xx', async () => {
    const res = await request(app).get('/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Recurso no encontrado');
  });
});
