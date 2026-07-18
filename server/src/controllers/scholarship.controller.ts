import type { Request, Response } from 'express';
import { ScholarshipRegistration } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * POST /api/v1/scholarships/register
 *
 * Receives validated request body and creates a new scholarship registration entry in the database.
 */
export const createRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      studentName,
      studentPhone,
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
    } = req.body;

    const registration = await ScholarshipRegistration.create({
      studentName,
      studentPhone,
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
    });

    res.status(201).json({
      status: 'success',
      message: 'Scholarship registration submitted successfully',
      data: {
        registration,
      },
    });
  },
);
