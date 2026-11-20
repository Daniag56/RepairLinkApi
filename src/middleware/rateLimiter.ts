import rateLimit from 'express-rate-limit';
import type { Options } from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

function onLimitReached(req: Request, res: Response, _next: NextFunction, options: Options) {
  logger.warn(`Límite de peticiones superado: ${req.method} ${req.originalUrl} desde ${req.ip}`);
  res.status(options.statusCode).json(options.message);
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos' },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});
