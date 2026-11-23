
import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { requireOwner } from '../../middleware/owner.js';
import { validate } from '../../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schema.js';
import { getTaskOwnerId } from './tasks.service.js';
import {
  createTaskCtrl,
  listTasksCtrl,
  getTaskCtrl,
  updateTaskCtrl,
  deleteTaskCtrl,
} from './tasks.controller.js';

const router = Router();


/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Lista las tareas del usuario autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida correctamente. Devuelve un array, que puede estar vacío.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             example:
 *               - id: 1
 *                 title: Reparar bicicleta
 *                 description: Revisar los frenos
 *                 done: false
 *                 createdAt: '2026-11-20T10:00:00.000Z'
 *                 userId: 1
 *               - id: 2
 *                 title: Revisar motor
 *                 description: Cambio de aceite
 *                 done: true
 *                 createdAt: '2026-11-20T11:00:00.000Z'
 *                 userId: 2
 */
router.get('/', auth, listTasksCtrl);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: La tarea es de otro usuario
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', auth, requireOwner(getTaskOwnerId, 'Tarea no encontrada'), getTaskCtrl);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crea una nueva tarea del usuario autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos o usuario inexistente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', auth, validate(createTaskSchema), createTaskCtrl);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Actualiza una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID inválido, datos inválidos o usuario inexistente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: La tarea es de otro usuario
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/:id', auth, requireOwner(getTaskOwnerId, 'Tarea no encontrada'), validate(updateTaskSchema), updateTaskCtrl);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     responses:
 *       204:
 *         description: Tarea eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: La tarea es de otro usuario
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', auth, requireOwner(getTaskOwnerId, 'Tarea no encontrada'), deleteTaskCtrl);

export default router;
