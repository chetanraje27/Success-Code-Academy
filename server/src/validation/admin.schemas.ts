import { z } from 'zod';

const imageLocation = z
  .string()
  .trim()
  .min(1, 'An image is required')
  .max(2048)
  .refine(
    (value) =>
      value.startsWith('/') ||
      /^https:\/\/[^\s]+$/i.test(value),
    'Use a local image path or an HTTPS image URL',
  );

const optionalLink = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      value === '' ||
      value.startsWith('/') ||
      /^https:\/\/[^\s]+$/i.test(value),
    'Use a local path or an HTTPS URL',
  )
  .optional();

const orderIndex = z.coerce.number().int().min(0).max(10000).default(0);

export const idParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const mediaResourceParamsSchema = z
  .object({
    resourceType: z.enum(['banner', 'star', 'result', 'news', 'video']),
  })
  .strict();

export const mediaHistoryParamsSchema = mediaResourceParamsSchema
  .extend({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const mediaRestoreParamsSchema = mediaHistoryParamsSchema
  .extend({
    revisionId: z.coerce.number().int().positive(),
  })
  .strict();

export const uploadQuerySchema = z
  .object({
    type: z.enum(['banner', 'star', 'result', 'uploads', 'news', 'video']).default('uploads'),
  })
  .strict();

export const bannerCreateSchema = z
  .object({
    type: z.enum(['HOME', 'RESULTS']),
    image: imageLocation,
    altText: z.string().trim().min(2).max(180),
    targetUrl: optionalLink,
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const bannerUpdateSchema = bannerCreateSchema.partial().strict();

export const notificationCreateSchema = z
  .object({
    text: z.string().trim().min(2).max(280),
    link: optionalLink,
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const notificationUpdateSchema =
  notificationCreateSchema.partial().strict();

export const starCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    score: z.string().trim().min(1).max(60),
    rank: z.string().trim().min(1).max(80),
    course: z.string().trim().min(2).max(160),
    year: z.string().trim().min(2).max(40),
    image: imageLocation,
    colorHex: z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex colour'),
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const starUpdateSchema = starCreateSchema.partial().strict();

export const resultCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    image: imageLocation,
    year: z.coerce.number().int().min(2000).max(2100),
    college: z.string().trim().max(180).optional(),
    city: z.string().trim().max(120).optional(),
    marks: z.coerce.number().int().min(0).max(720).optional(),
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const resultUpdateSchema = resultCreateSchema.partial().strict();

export const newsCreateSchema = z
  .object({
    category: z.string().trim().min(2).max(100),
    title: z.string().trim().min(2).max(200),
    shortTitle: z.string().trim().max(100).optional(),
    excerpt: z.string().trim().min(2).max(500),
    date: z.string().trim().min(2).max(40),
    author: z.string().trim().min(2).max(100),
    readTime: z.string().trim().min(2).max(40),
    image: imageLocation,
    slug: z.string().trim().min(2).max(200),
    externalUrl: optionalLink,
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const newsUpdateSchema = newsCreateSchema.partial().strict();

export const videoCreateSchema = z
  .object({
    category: z.string().trim().min(2).max(100),
    title: z.string().trim().min(2).max(200),
    excerpt: z.string().trim().min(2).max(500),
    date: z.string().trim().min(2).max(40),
    duration: z.string().trim().min(2).max(20),
    image: imageLocation,
    videoUrl: z.string().trim().min(2).max(2048),
    isActive: z.boolean().default(true),
    orderIndex,
  })
  .strict();

export const videoUpdateSchema = videoCreateSchema.partial().strict();

export const settingsUpdateSchema = z
  .object({
    phone: z.string().trim().max(40).optional(),
    email: z.union([z.literal(''), z.string().trim().email()]).optional(),
    address: z.string().trim().max(500).optional(),
    whatsapp: z.string().trim().max(2048).optional(),
    facebook: optionalLink,
    instagram: optionalLink,
    youtube: optionalLink,
    linkedin: optionalLink,
    twitter: optionalLink,
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Provide at least one setting to update',
  });

export const adminListQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional().default(''),
    cursor: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .strict();

export const resultListQuerySchema = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  })
  .strict();

const contentIdentifier = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(
    /^[a-z0-9][a-z0-9._:-]*$/,
    'Use lowercase letters, numbers, dots, dashes, underscores, or colons',
  );

export const pageContentParamsSchema = z
  .object({
    pageKey: contentIdentifier,
  })
  .strict();

export const contentBlockParamsSchema = z
  .object({
    pageKey: contentIdentifier,
    contentKey: contentIdentifier,
  })
  .strict();

export const contentBlockUpdateSchema = z
  .object({
    kind: z.enum(['text', 'multiline']).default('text'),
    value: z.string().max(20_000),
  })
  .strict();
export const adminCreateUserSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    mobileNumber: z.string().trim().min(10).max(15),
    email: z.string().email(),
    age: z.coerce.number().int().min(5).max(100),
    role: z.enum(['student', 'admin']).default('student'),
    password: z.string().min(6),
  })
  .strict();

export const adminUpdateUserSchema = adminCreateUserSchema.extend({
  password: z.string().min(6).optional().or(z.literal('')),
}).partial().strict();

export const adminCreateCourseFormSchema = z
  .object({
    studentName: z.string().trim().min(1),
    courseTitle: z.string().trim().min(1),
    studentEmail: z.string().trim().email(),
    studentPhone: z.string().trim().min(10).max(15),
    visitingDate: z.string().trim().min(1),
    visitingTime: z.string().trim().min(1),
  })
  .strict();

export const adminUpdateCourseFormSchema = adminCreateCourseFormSchema.partial().strict();

export const adminCreateScholarshipFormSchema = z
  .object({
    studentName: z.string().trim().min(1),
    studentPhone: z.string().trim().min(10).max(15),
    parentPhone: z.string().trim().min(10).max(15),
    studentClass: z.string().trim().min(1),
    schoolName: z.string().trim().min(1),
    city: z.string().trim().min(1),
    preferredCourse: z.string().trim().min(1),
  })
  .strict();

export const adminUpdateScholarshipFormSchema = adminCreateScholarshipFormSchema.partial().strict();

export const adminCreateContactMessageSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    phone: z.string().trim().min(10).max(15),
    message: z.string().trim().min(1),
  })
  .strict();

export const adminUpdateContactMessageSchema = adminCreateContactMessageSchema.partial().strict();
