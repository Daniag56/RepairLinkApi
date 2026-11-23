import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { env } from '../config/env.js';

const app = express();
app.get('/solo-taller', auth, requireRole('TALLER'), (_req, res) => res.json({ ok: true }));
app.get('/solo-cliente', auth, requireRole('CLIENTE'), (_req, res) => res.json({ ok: true }));

const clienteToken = jwt.sign({ sub: 1, email: 'cliente@example.com', role: 'CLIENTE' }, env.JWT_SECRET);
const tallerToken = jwt.sign({ sub: 2, email: 'taller@example.com', role: 'TALLER' }, env.JWT_SECRET);

describe('Middleware de rol', () => {
  it('debe dar 401 sin token', async () => {
    const res = await request(app).get('/solo-taller');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No autorizado');
  });

  it('debe dar 401 con un token inválido', async () => {
    const res = await request(app)
      .get('/solo-taller')
      .set('Authorization', 'Bearer token_falso');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token inválido');
  });

  it('debe dar 401 con un token sin rol', async () => {
    const tokenSinRol = jwt.sign({ sub: 1, email: 'viejo@example.com' }, env.JWT_SECRET);
    const res = await request(app)
      .get('/solo-taller')
      .set('Authorization', `Bearer ${tokenSinRol}`);

    expect(res.status).toBe(401);
  });

  it('un cliente no puede entrar en una ruta del taller', async () => {
    const res = await request(app)
      .get('/solo-taller')
      .set('Authorization', `Bearer ${clienteToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acceso denegado');
  });

  it('un taller no puede entrar en una ruta del cliente', async () => {
    const res = await request(app)
      .get('/solo-cliente')
      .set('Authorization', `Bearer ${tallerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acceso denegado');
  });

  it('un taller sí entra en una ruta del taller', async () => {
    const res = await request(app)
      .get('/solo-taller')
      .set('Authorization', `Bearer ${tallerToken}`);

    expect(res.status).toBe(200);
  });

  it('un cliente sí entra en una ruta del cliente', async () => {
    const res = await request(app)
      .get('/solo-cliente')
      .set('Authorization', `Bearer ${clienteToken}`);

    expect(res.status).toBe(200);
  });
});
