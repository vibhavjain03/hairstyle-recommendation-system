import { Response, NextFunction } from 'express';
import Scan from '../models/Scan.js';
import Recommendation from '../models/Recommendation.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { generateRecommendations } from '../services/recommendationService.js';
import { processImageUpload } from '../services/storageService.js';

// @desc    Create scan entry and generate recommendations
// @route   POST /api/scans
// @access  Public / Optional Auth
export const createScan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { detectedFaceShape, landmarkData, metrics, imageUrl: base64ImageUrl, gender } = req.body;

    if (!detectedFaceShape) {
      res.status(400).json({ success: false, error: 'Detected face shape is required' });
      return;
    }

    let finalImageUrl = '';

    // Handle multipart file upload or base64 / fallback URL
    if (req.file) {
      finalImageUrl = await processImageUpload(req.file.path);
    } else if (base64ImageUrl) {
      finalImageUrl = base64ImageUrl;
    } else {
      finalImageUrl = '/uploads/sample-scan.jpg';
    }

    // Parse landmarks / metrics if JSON string
    let parsedLandmarks = landmarkData;
    if (typeof landmarkData === 'string') {
      try {
        parsedLandmarks = JSON.parse(landmarkData);
      } catch (e) {
        parsedLandmarks = {};
      }
    }

    let parsedMetrics = metrics;
    if (typeof metrics === 'string') {
      try {
        parsedMetrics = JSON.parse(metrics);
      } catch (e) {
        parsedMetrics = {};
      }
    }

    // 1. Create Scan Document
    const scan = await Scan.create({
      userId: req.user ? req.user._id : undefined,
      uploadedImageUrl: finalImageUrl,
      detectedFaceShape,
      landmarkData: parsedLandmarks || {},
      metrics: parsedMetrics || {}
    });

    // 2. Generate Hairstyle Recommendations
    const recData = await generateRecommendations(detectedFaceShape, gender);

    // 3. Create Recommendation Document
    const recommendation = await Recommendation.create({
      scanId: scan._id,
      hairstyles: recData.hairstyles.map((item) => ({
        hairstyle: item.hairstyle._id,
        score: item.score
      })),
      groomingTips: recData.groomingTips
    });

    const populatedRec = await Recommendation.findById(recommendation._id).populate('hairstyles.hairstyle');

    res.status(201).json({
      success: true,
      data: {
        scan,
        recommendation: populatedRec,
        styles: recData.hairstyles.map((h) => h.hairstyle.name),
        groomingTips: recData.groomingTips,
        hairstylesFull: recData.hairstyles
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user scan history
// @route   GET /api/scans/history
// @access  Private
export const getScanHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const scans = await Scan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const scanIds = scans.map((s) => s._id);

    const recommendations = await Recommendation.find({ scanId: { $in: scanIds } }).populate('hairstyles.hairstyle');

    // Map scan id to recommendation
    const recMap: Record<string, any> = {};
    recommendations.forEach((rec) => {
      recMap[rec.scanId.toString()] = rec;
    });

    const history = scans.map((scan) => ({
      scan,
      recommendation: recMap[scan._id.toString()] || null
    }));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    next(err);
  }
};
