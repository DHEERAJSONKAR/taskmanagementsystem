import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /auth/register
router.post('/register', AuthController.register);

// POST /auth/login
router.post('/login', AuthController.login);

// POST /auth/refresh
router.post('/refresh', AuthController.refresh);

// POST /auth/logout
router.post('/logout', AuthController.logout);

// GET /auth/me
router.get('/me', authenticate, AuthController.getMe);

export default router;
