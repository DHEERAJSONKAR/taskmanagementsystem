import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const userId = req.user!.userId;

      if (!title) {
        res.status(400).json({
          success: false,
          message: 'Title is required',
        });
        return;
      }

      const task = await TaskService.createTask({
        title,
        description,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create task',
      });
    }
  }

  static async getTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        completed: req.query.completed as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
      };

      const result = await TaskService.getTasks(userId, query);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result.tasks,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve tasks',
      });
    }
  }

  static async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const task = await TaskService.getTaskById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Task not found',
      });
    }
  }

  static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { title, description, completed } = req.body;

      const task = await TaskService.updateTask(id, userId, {
        title,
        description,
        completed,
      });

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update task',
      });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await TaskService.deleteTask(id, userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete task',
      });
    }
  }

  static async toggleTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const task = await TaskService.toggleTask(id, userId);

      res.status(200).json({
        success: true,
        message: 'Task status toggled successfully',
        data: task,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle task status',
      });
    }
  }
}
