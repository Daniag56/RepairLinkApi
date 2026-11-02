import { prisma } from '../../config/db.js';

export async function createUser(email: string, name: string, passwordHash: string) {
  return prisma.user.create({ 
    data: { email, name, passwordHash }, 
    select: { id: true, email: true, name: true, createdAt: true } 
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ 
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true }
  });
}

export async function listUsers() {
  return prisma.user.findMany({ 
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { id: 'asc' }
  });
}

export async function updateUser(id: number, data: { name?: string; email?: string }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, createdAt: true }
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}

