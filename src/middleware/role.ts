import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
}
