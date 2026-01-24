import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// GET /tasks - Get all tasks (with pagination, filter, search)
router.get('/', TaskController.getTasks);

// POST /tasks - Create a new task
router.post('/', TaskController.createTask);

// GET /tasks/:id - Get a single task
router.get('/:id', TaskController.getTaskById);

// PATCH /tasks/:id - Update a task
router.patch('/:id', TaskController.updateTask);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', TaskController.deleteTask);

// PATCH /tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', TaskController.toggleTask);

export default router;
