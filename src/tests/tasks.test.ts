import request from 'supertest';
import app from '../app.js';

describe('Tasks Endpoints (propietario)', () => {
  let tokenAna: string;
  let tokenLuis: string;
  let idAna: number;
  let tareaDeAna: number;

  beforeAll(async () => {
    const ana = await request(app)
      .post('/api/auth/register')
      .send({ email: `ana${Date.now()}@example.com`, name: 'Ana', password: 'password123' });

    const luis = await request(app)
      .post('/api/auth/register')
      .send({ email: `luis${Date.now()}@example.com`, name: 'Luis', password: 'password123' });

    tokenAna = ana.body.token;
    idAna = ana.body.user.id;
    tokenLuis = luis.body.token;

    const tarea = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenAna}`)
      .send({ title: 'Cambiar aceite' });

    tareaDeAna = tarea.body.id;
  });

  it('debe dar 401 sin token', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(401);
  });

  it('debe crear la tarea a nombre del usuario del token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenAna}`)
      .send({ title: 'Revisar frenos', userId: 99999 });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(idAna);
  });

  it('debe listar solo las tareas propias', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${tokenLuis}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('el dueño puede leer su tarea', async () => {
    const res = await request(app)
      .get(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenAna}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Cambiar aceite');
  });

  it('otro usuario no puede leerla', async () => {
    const res = await request(app)
      .get(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenLuis}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acceso denegado');
  });

  it('otro usuario no puede cambiarla', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenLuis}`)
      .send({ done: true });

    expect(res.status).toBe(403);
  });

  it('otro usuario no puede borrarla', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenLuis}`);

    expect(res.status).toBe(403);
  });

  it('debe dar 404 si la tarea no existe', async () => {
    const res = await request(app)
      .get('/api/tasks/99999')
      .set('Authorization', `Bearer ${tokenAna}`);

    expect(res.status).toBe(404);
  });

  it('el dueño puede cambiarla y borrarla', async () => {
    const cambio = await request(app)
      .patch(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenAna}`)
      .send({ done: true });

    expect(cambio.status).toBe(200);
    expect(cambio.body.done).toBe(true);

    const borrado = await request(app)
      .delete(`/api/tasks/${tareaDeAna}`)
      .set('Authorization', `Bearer ${tokenAna}`);

    expect(borrado.status).toBe(204);
  });
});
