import { Response, NextFunction } from 'express';
import Feedback from '../models/Feedback.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Submit feedback for a recommendation
// @route   POST /api/feedback
// @access  Public / Optional Auth
export const submitFeedback = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { recommendationId, hairstyleId, liked, comment } = req.body;

    if (!recommendationId || typeof liked !== 'boolean') {
      res.status(400).json({ success: false, error: 'Please provide recommendationId and liked status' });
      return;
    }

    const feedback = await Feedback.create({
      userId: req.user ? req.user._id : undefined,
      recommendationId,
      hairstyleId,
      liked,
      comment: comment || ''
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get feedback for a specific recommendation or user
// @route   GET /api/feedback/:recommendationId
// @access  Public
export const getFeedbackForRecommendation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { recommendationId } = req.params;
    const feedbacks = await Feedback.find({ recommendationId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    next(err);
  }
};
