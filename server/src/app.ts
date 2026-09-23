import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import hairstyleRoutes from './routes/hairstyleRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Application = express();

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/hairstyles', hairstyleRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Hairstyle Recommendation API'
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
