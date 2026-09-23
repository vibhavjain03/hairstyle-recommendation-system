import { Router } from 'express';
import { createScan, getScanHistory } from '../controllers/scanController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { uploadMiddleware } from '../services/storageService.js';
import { scanRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/',
  scanRateLimiter,
  optionalProtect,
  uploadMiddleware.single('image'),
  createScan
);

router.get('/history', protect, getScanHistory);

export default router;
