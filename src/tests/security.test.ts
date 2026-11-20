import request from 'supertest';
import app from '../app.js';

describe('CORS y cabeceras de seguridad', () => {
  it('deja pasar una petición desde la web permitida', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:4200');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:4200');
  });

  it('rechaza una petición desde un origen no permitido', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://web-falsa.example.com');

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Origen no permitido');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('deja pasar una petición sin Origin, como la de la app Android', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
  });

  it('pone las cabeceras de Helmet en la API', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('quita la Content-Security-Policy solo en Swagger', async () => {
    const res = await request(app).get('/api-docs/');

    expect(res.status).toBe(200);
    expect(res.headers['content-security-policy']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
