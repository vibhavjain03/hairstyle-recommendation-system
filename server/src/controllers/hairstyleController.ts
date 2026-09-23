import { Request, Response, NextFunction } from 'express';
import Hairstyle from '../models/Hairstyle.js';

// @desc    Get hairstyles list / filter by shape, gender, tag
// @route   GET /api/hairstyles
// @access  Public
export const getHairstyles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shape, gender, tag } = req.query;
    const filter: any = {};

    if (shape) {
      filter.faceShapesSuited = { $in: [shape as string] };
    }
    if (gender) {
      filter.gender = { $in: [gender as string, 'unisex'] };
    }
    if (tag) {
      filter.tags = { $in: [tag as string] };
    }

    const hairstyles = await Hairstyle.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hairstyles.length,
      data: hairstyles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new hairstyle entry (Admin)
// @route   POST /api/hairstyles
// @access  Private / Admin
export const createHairstyle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hairstyle = await Hairstyle.create(req.body);

    res.status(201).json({
      success: true,
      data: hairstyle
    });
  } catch (err) {
    next(err);
  }
};
