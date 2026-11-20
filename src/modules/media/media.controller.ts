import type { Request, Response } from 'express';
import * as mediaService from './media.service.js';
import { logger } from '../../utils/logger.js';

export async function uploadCtrl(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No se ha proporcionado ningún archivo',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: 'No autorizado',
      });
    }

    const media = await mediaService.uploadMedia(
      req.user.sub,
      req.file
    );

    logger.info(`Media uploaded by user ${req.user.sub}`);

    return res.status(201).json(media);
  } catch (error) {
    logger.error('Error uploading media:', error);

    return res.status(500).json({
      message: 'Error al subir el archivo',
    });
  }
}
