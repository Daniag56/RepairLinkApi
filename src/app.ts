import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/error.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import usersRoutes from './modules/users/users.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter);
}


app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.use('/api/auth', authLimiter, authRoutes);
} else {
  app.use('/api/auth', authRoutes);
}

app.use(errorHandler);
export default app;
