import type { Request, Response } from 'express';
import { createTask, listTasks, findTaskById, updateTask, deleteTask } from './tasks.service.js';

export async function createTaskCtrl(req: Request, res: Response) {
  try {
    const task = await createTask(req.body);
    return res.status(201).json(task);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'El usuario indicado no existe' });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function listTasksCtrl(_req: Request, res: Response) {
  const tasks = await listTasks();
  return res.json(tasks);
}

export async function getTaskCtrl(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const task = await findTaskById(id);

  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  return res.json(task);
}

export async function updateTaskCtrl(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const task = await updateTask(id, req.body);
    return res.json(task);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'El usuario indicado no existe' });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function deleteTaskCtrl(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    await deleteTask(id);
    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}