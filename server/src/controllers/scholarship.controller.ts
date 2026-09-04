import type { Request, Response } from 'express';
import { ScholarshipRegistration } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../utils/logger';
import { sendMail, brand } from '../utils/mailer';
import { scholarshipRegistrationReceipt, scholarshipRegistrationStaffAlert } from '../utils/emailTemplates';
import { AppError } from '../utils/AppError';

/**
 * GET /api/v1/scholarships/me
 *
 * Retrieves the scholarship registration for the authenticated user, if any.
 */
export const getMyRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const registration = await ScholarshipRegistration.findOne({
      where: { userId },
    });

    if (!registration) {
      res.status(404).json({
        status: 'fail',
        message: 'No registration found.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        registration,
      },
    });
  }
);

/**
 * PUT /api/v1/scholarships/me
 *
 * Updates the scholarship registration for the authenticated user.
 */
export const updateMyRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
      scholarshipProgram,
    } = req.body;

    const registration = await ScholarshipRegistration.findOne({
      where: { userId },
    });

    if (!registration) {
      throw new AppError('No registration found.', 404);
    }

    await registration.update({
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
      scholarshipProgram,
    });

    res.status(200).json({
      status: 'success',
      message: 'Scholarship registration updated successfully',
      data: {
        registration,
      },
    });
  }
);

/**
 * POST /api/v1/scholarships/register
 *
 * Receives validated request body and creates a new scholarship registration entry in the database.
 */
export const createRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Ensure user doesn't already have one
    const existing = await ScholarshipRegistration.findOne({
      where: { userId },
    });
    if (existing) {
      throw new AppError('You have already submitted a scholarship registration.', 400);
    }

    const {
      studentName,
      studentPhone,
      studentEmail,
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
      scholarshipProgram,
    } = req.body;

    const registration = await ScholarshipRegistration.create({
      userId,
      studentEmail,
      scholarshipProgram,
      studentName,
      studentPhone,
      parentPhone,
      studentClass,
      schoolName,
      city,
      preferredCourse,
    });

    logger.info(
      `🎓 [Scholarship] New SCST registration: ${studentName} (${studentClass}, ${city})`
    );

    if (studentEmail) {
      const template = scholarshipRegistrationReceipt({
        studentName,
        studentClass,
        schoolName,
        city,
        preferredCourse,
      });
      void sendMail({
        to: studentEmail,
        subject: `Your SCST registration is confirmed — ${studentName}`,
        text: template.text,
        html: template.html,
      }).then((mail) => {
        if (!mail.delivered) {
          logger.warn('[Scholarship] Receipt email failed', { error: mail.error });
        }
      });
    }

    // Alert for admin
    const adminTemplate = scholarshipRegistrationStaffAlert({
      studentName,
      studentPhone,
      studentEmail,
      studentClass,
      schoolName,
      city,
      preferredCourse,
      scholarshipProgram,
    });
    void sendMail({
      to: brand.email,
      subject: `New SCST registration — ${studentName} (${studentClass})`,
      text: adminTemplate.text,
      html: adminTemplate.html,
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
