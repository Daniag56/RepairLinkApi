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

export async function listCtrl(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const media = await mediaService.listUserMedia(req.user.sub);

    return res.status(200).json(media);
  } catch (error) {
    logger.error('Error listing media:', error);

    return res.status(500).json({
      message: 'Error al listar los archivos',
    });
  }
}

export async function getByIdCtrl(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const media = await mediaService.getMediaById(id);

    if (!media) {
      return res.status(404).json({
        message: 'Archivo no encontrado',
      });
    }

    if (media.userId !== req.user.sub) {
      return res.status(403).json({
        message: 'No tienes permiso para acceder a este archivo',
      });
    }

    return res.status(200).json(media);
  } catch (error) {
    logger.error('Error getting media:', error);

    return res.status(500).json({
      message: 'Error al obtener el archivo',
    });
  }
}

export async function deleteCtrl(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const media = await mediaService.deleteMedia(id, req.user.sub);

    if (!media) {
      return res.status(404).json({
        message: 'Archivo no encontrado',
      });
    }

    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting media:', error);

    return res.status(500).json({
      message: 'Error al eliminar el archivo',
    });
  }
}
