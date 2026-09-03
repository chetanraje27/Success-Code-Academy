import type { Request, Response } from 'express';
import { ContactMessage, CourseRegistration } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../utils/logger';
import { sendMail, brand } from '../utils/mailer';
import {
  contactFormReceipt,
  contactFormStaffAlert,
  courseRegistrationReceipt,
} from '../utils/emailTemplates';

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

    // Receipt to the sender, best-effort.
    const receipt = contactFormReceipt({ name, email, phone, message });
    void sendMail({
      to: email,
      subject: 'We received your message — Success Code Academy',
      text: receipt.text,
      html: receipt.html,
    }).then((mail) => {
      if (!mail.delivered) {
        logger.warn('[Contact Form] Receipt email failed', { to: email, error: mail.error });
      }
    });

    // Staff alert to the academy inbox, best-effort, reply-to the sender.
    const alert = contactFormStaffAlert({ name, email, phone, message });
    void sendMail({
      to: brand.email,
      subject: `New contact enquiry from ${name}`,
      text: alert.text,
      html: alert.html,
      replyTo: email,
    }).then((mail) => {
      if (!mail.delivered) {
        logger.warn('[Contact Form] Staff alert email failed', { error: mail.error });
      }
    });

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

    // Confirmation to the student, best-effort.
    const template = courseRegistrationReceipt({
      studentName,
      courseTitle,
      visitingDate,
      visitingTime,
    });
    void sendMail({
      to: studentEmail,
      subject: `Your campus visit is confirmed — ${courseTitle}`,
      text: template.text,
      html: template.html,
    }).then((mail) => {
      if (!mail.delivered) {
        logger.warn('[Course Registration] Confirmation email failed', {
          to: studentEmail,
          error: mail.error,
        });
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Course registration saved successfully.',
      data: {
        id: newRegistration.id,
      },
    });
  }
);
