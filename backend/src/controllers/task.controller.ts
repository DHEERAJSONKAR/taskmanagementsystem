import { Response } from 'express';
import * as taskService from '../services/task.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasksData = await taskService.getTasks(req.user!.id, req.query);
  res.status(200).json(new ApiResponse(200, tasksData));
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const task = await taskService.getTaskById(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, task));
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const task = await taskService.createTask(req.body, req.user!.id);
  res.status(201).json(new ApiResponse(201, task, 'Task created'));
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.body,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, task, 'Task updated'));
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  await taskService.deleteTask(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, {}, 'Task deleted'));
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const task = await taskService.toggleTaskCompletion(
    req.params.id,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, task, 'Task toggled'));
};
