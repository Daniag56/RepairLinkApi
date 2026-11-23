
import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth.js';
import {
  uploadCtrl,
  listCtrl,
  getByIdCtrl,
  deleteCtrl,
} from './media.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Gestión de archivos multimedia
 */

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Subir un archivo multimedia
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Archivo subido correctamente
 *       400:
 *         description: Archivo no proporcionado o tipo no permitido
 *       401:
 *         description: No autorizado
 */
router.post('/upload', auth, upload.single('file'), uploadCtrl);

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Listar archivos multimedia del usuario
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de archivos multimedia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, listCtrl);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Obtener un archivo multimedia por ID
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permiso para acceder al archivo
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/:id', auth, getByIdCtrl);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Eliminar un archivo multimedia
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Archivo eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Archivo no encontrado
 */
router.delete('/:id', auth, deleteCtrl);

export default router;
