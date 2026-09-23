import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found with specified ID';
    return res.status(404).json({ success: false, error: message });
  }

  // Mongoose Duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({ success: false, error: message });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    return res.status(400).json({ success: false, error: message });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: error.message || 'Server Internal Error'
  });
};
