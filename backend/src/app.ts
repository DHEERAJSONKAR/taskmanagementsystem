import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Task Management API is running',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        refresh: 'POST /auth/refresh',
        logout: 'POST /auth/logout',
      },
      tasks: {
        getAll: 'GET /tasks',
        create: 'POST /tasks',
        getOne: 'GET /tasks/:id',
        update: 'PATCH /tasks/:id',
        delete: 'DELETE /tasks/:id',
        toggle: 'PATCH /tasks/:id/toggle',
      },
    },
  });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
