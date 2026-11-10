import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/error.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import usersRoutes from './modules/users/users.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// CONFIGURACIÓN ORIGINAL DEL PROYECTO
// Recuperar esta configuración cuando terminemos la prueba
// de las 200 llamadas y decidamos cómo gestionar /health.

/*
if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter);
}

app.get('/health', (_req, res) => res.json({ ok: true }));
*/


// CONFIGURACIÓN TEMPORAL PARA LA PRUEBA DE 200 PETICIONES
// Se coloca /health antes del limitador para que las 200 llamadas
// de nuestro script no sean bloqueadas por el rate limiting.

app.get('/health', (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.use('/api/auth', authLimiter, authRoutes);
} else {
  app.use('/api/auth', authRoutes);
}

app.use(errorHandler);
export default app;
