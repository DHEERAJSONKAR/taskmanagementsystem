import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
