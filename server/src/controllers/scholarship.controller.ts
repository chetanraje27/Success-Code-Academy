import type { Request, Response } from 'express';
import { ScholarshipRegistration } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../utils/logger';
import { sendMail } from '../utils/mailer';
import { scholarshipRegistrationReceipt } from '../utils/emailTemplates';

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

    logger.info(
      `🎓 [Scholarship] New SCST registration: ${studentName} (${studentClass}, ${city})`,
    );

    // Confirmation email. The public form does not collect an address, so it
    // is delivered to the academy inbox for the admissions team to act on.
    const template = scholarshipRegistrationReceipt({
      studentName,
      studentClass,
      schoolName,
      city,
      preferredCourse,
    });
    void sendMail({
      to: 'successcodeacademy@gmail.com',
      subject: `New SCST registration — ${studentName} (${studentClass})`,
      text: template.text,
      html: template.html,
    }).then((mail) => {
      if (!mail.delivered) {
        logger.warn('[Scholarship] Registration alert email failed', { error: mail.error });
      }
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
