import { ValidationUtil } from '../utils/validation.util';
import prisma from '../config/prisma';

interface CreateTaskData {
  title: string;
  description?: string;
  userId: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

interface GetTasksQuery {
  page?: number;
  limit?: number;
  completed?: 'true' | 'false';
  search?: string;
}

export class TaskService {
  static async createTask(data: CreateTaskData) {
    const { title, description, userId } = data;

    if (!ValidationUtil.isValidTitle(title)) {
      throw new Error('Title is required');
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        userId,
      },
    });

    return task;
  }

  static async getTasks(userId: string, query: GetTasksQuery) {
    const page = query.page ? parseInt(String(query.page)) : 1;
    const limit = query.limit ? parseInt(String(query.limit)) : 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    // Filter by completed status
    if (query.completed === 'true') {
      where.completed = true;
    } else if (query.completed === 'false') {
      where.completed = false;
    }

    // Search by title
    if (query.search) {
      where.title = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // Get tasks and total count
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  static async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskData
  ) {
    // Verify task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Validate title if provided
    if (data.title !== undefined && !ValidationUtil.isValidTitle(data.title)) {
      throw new Error('Title cannot be empty');
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && {
          description: data.description?.trim(),
        }),
        ...(data.completed !== undefined && { completed: data.completed }),
      },
    });

    return task;
  }

  static async deleteTask(taskId: string, userId: string) {
    // Verify task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }

  static async toggleTask(taskId: string, userId: string) {
    // Verify task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Toggle completed status
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !existingTask.completed,
      },
    });

    return task;
  }
}
