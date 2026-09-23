import { Router } from 'express';
import { submitFeedback, getFeedbackForRecommendation } from '../controllers/feedbackController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalProtect, submitFeedback);
router.get('/:recommendationId', getFeedbackForRecommendation);

export default router;
