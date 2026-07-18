import type { Request, Response } from 'express';
import { ContactMessage, CourseRegistration } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../utils/logger';

/**
 * POST /api/v1/forms/contact
 * Handles submissions from the Contact Us page.
 */
export const submitContactForm = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    logger.info(`📧 [Contact Form] New message received from ${name} (${email})`);

    res.status(201).json({
      status: 'success',
      message: 'Contact message saved successfully.',
      data: {
        id: newMessage.id,
      },
    });
  }
);

/**
 * POST /api/v1/forms/course-register
 * Handles submissions from the Course Registration forms.
 */
export const submitCourseRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { courseTitle, studentName, studentEmail, studentPhone, visitingDate, visitingTime } = req.body;

    const newRegistration = await CourseRegistration.create({
      courseTitle,
      studentName,
      studentEmail,
      studentPhone,
      visitingDate,
      visitingTime,
    });

    logger.info(`🎓 [Course Registration] New registration for ${courseTitle} by ${studentName}`);

    res.status(201).json({
      status: 'success',
      message: 'Course registration saved successfully.',
      data: {
        id: newRegistration.id,
      },
    });
  }
);
