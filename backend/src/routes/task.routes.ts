import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.route('/').get(taskController.getTasks).post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router.patch('/:id/toggle', taskController.toggleTask);

export default router;
