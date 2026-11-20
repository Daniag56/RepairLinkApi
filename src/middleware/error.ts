import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} ${status}: ${err.stack ?? err.message}`);
    const message = env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor';
    return res.status(status).json({ message });
  }

  res.status(status).json({ message: err.message });
}
