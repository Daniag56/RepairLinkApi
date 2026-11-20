import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requireOwner(getOwnerId: (id: number) => Promise<number | null>, notFoundMessage: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const ownerId = await getOwnerId(id);

    if (ownerId === null) {
      return res.status(404).json({ message: notFoundMessage });
    }

    if (ownerId !== req.user.sub) {
      logger.warn(`Acceso denegado por propietario: usuario ${req.user.sub} en ${req.method} ${req.originalUrl}`);
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
}
