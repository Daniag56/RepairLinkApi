import { prisma } from '../../config/db.js';

export async function createTask(data: {
  title: string;
  description?: string;
  userId: number;
}) {
  return prisma.task.create({
    data: {
      title: data.title,
      ...(data.description !== undefined ? { description: data.description } : {}),
      userId: data.userId,
    },
  });
}

export async function listTasks(userId: number) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { id: 'asc' },
  });
}

export async function findTaskById(id: number) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function getTaskOwnerId(id: number) {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { userId: true },
  });
  return task?.userId ?? null;
}

export async function updateTask(id: number, data: {
  title?: string;
  description?: string | null;
  done?: boolean;
}) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: { id },
  });
}