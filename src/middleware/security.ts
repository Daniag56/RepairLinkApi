import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env.js';

const helmetApi = helmet();
const helmetDocs = helmet({ contentSecurityPolicy: false });

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api-docs')) {
    return helmetDocs(req, res, next);
  }
  return helmetApi(req, res, next);
}

export const corsPolicy = cors({
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(Object.assign(new Error('Origen no permitido'), { status: 403 }));
  },
});
