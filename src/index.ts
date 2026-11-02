import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

