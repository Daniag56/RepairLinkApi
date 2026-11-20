import request from 'supertest';
import app from '../app.js';

describe('Media API', () => {
  let authToken: string;
  let mediaId: number;

  const testUser = {
    email: `mediatest${Date.now()}@example.com`,
    name: 'Media Test',
    password: 'Test1234',
  };

  const imageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(registerRes.status).toBe(201);
    authToken = registerRes.body.token;
  });

  describe('POST /api/media/upload', () => {
    it('debe subir una imagen correctamente', async () => {
      const res = await request(app)
        .post('/api/media/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', imageBuffer, 'test.png');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('publicId');
      expect(res.body).toHaveProperty('secureUrl');

      mediaId = res.body.id;
    }, 15000);

    it('debe fallar si no se proporciona ningún archivo', async () => {
      const res = await request(app)
        .post('/api/media/upload')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No se ha proporcionado ningún archivo');
    });

    it('debe fallar sin autenticación', async () => {
      const res = await request(app)
        .post('/api/media/upload')
        .attach('file', imageBuffer, 'test.png');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/media', () => {
    it('debe listar los archivos del usuario', async () => {
      const res = await request(app)
        .get('/api/media')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('debe fallar sin autenticación', async () => {
      const res = await request(app).get('/api/media');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/media/:id', () => {
    it('debe obtener un archivo por su ID', async () => {
      const res = await request(app)
        .get(`/api/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(mediaId);
    });

    it('debe fallar con un ID inválido', async () => {
      const res = await request(app)
        .get('/api/media/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
    });

    it('debe fallar si el archivo no existe', async () => {
      const res = await request(app)
        .get('/api/media/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/media/:id', () => {
    it('debe eliminar un archivo correctamente', async () => {
      const res = await request(app)
        .delete(`/api/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    }, 15000);

    it('debe fallar con un ID inválido', async () => {
      const res = await request(app)
        .delete('/api/media/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
    });

    it('debe fallar sin autenticación', async () => {
      const res = await request(app)
        .delete(`/api/media/${mediaId}`);

      expect(res.status).toBe(401);
    });
  });
});
