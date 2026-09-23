import { Router } from 'express';
import { getHairstyles, createHairstyle } from '../controllers/hairstyleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getHairstyles);
router.post('/', protect, createHairstyle);

export default router;
