import prisma from '../prisma';
import { ApiError } from '../utils/apiError';
import { Prisma } from '@prisma/client';

export const getTasks = async (userId: string, query: any) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search = '',
    completed,
  } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.TaskWhereInput = {
    userId,
    title: {
      contains: search,
      mode: 'insensitive',
    },
  };

  if (completed !== undefined) {
    where.completed = completed === 'true';
  }

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: limitNum,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalTasks = await prisma.task.count({ where });
  const totalPages = Math.ceil(totalTasks / limitNum);

  return { tasks, page: pageNum, limit: limitNum, totalPages, totalTasks };
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) {
    throw new ApiError(404, 'Task not found');
  }
  return task;
};

export const createTask = async (data: any, userId: string) => {
  const { title, description } = data;
  if (!title) {
    throw new ApiError(400, 'Title is required');
  }
  return prisma.task.create({
    data: { title, description, userId },
  });
};

export const updateTask = async (taskId: string, data: any, userId: string) => {
  const { title, description, completed } = data;
  const task = await getTaskById(taskId, userId); // Reuse to check ownership

  return prisma.task.update({
    where: { id: taskId },
    data: { title, description, completed },
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  await getTaskById(taskId, userId); // Reuse to check ownership
  return prisma.task.delete({ where: { id: taskId } });
};

export const toggleTaskCompletion = async (taskId: string, userId: string) => {
  const task = await getTaskById(taskId, userId); // Reuse to check ownership
  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
};
