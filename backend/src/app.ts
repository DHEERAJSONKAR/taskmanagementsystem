import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import errorHandler from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Global Error Handler
app.use(errorHandler);

export default app;
