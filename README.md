# Success Code Academy NEET Coaching Website - Project Master Context
 
> Staff instructions: see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for the dashboard
> and visual website editor.

> Updated from the final **Success Code Academy NEET Coaching Institute Website Feature Specification Document v1.0 (June 2026)**. This README is the single source of truth for the AI agent and developers working on the project.

---

## 1. Project Overview

Success Code Academy is a NEET coaching institute website focused on student enrollment, scholarship registrations, callback requests, and long-term trust building through results, resources, blogs, reviews, and student tools.

| Item | Final Requirement |
|---|---|
| Institute | Success Code Academy |
| Domain | NEET Coaching Institute |
| Audience | NEET aspirants from Class 11, Class 12, Repeaters, Foundation students, and parents |
| Primary Goal | Drive course enrollments, scholarship registrations, and callback requests |
| Secondary Goal | Build authority with results, blogs, study resources, toppers, and student reviews |
| Platform | Mobile-responsive web application with optional PWA support in later phases |
| Experience Goal | Modern, fast, trustworthy, conversion-optimized, and easy for non-technical staff to manage |

The website must feel like a premium ed-tech platform while remaining practical for a coaching institute: fast pages, clear CTAs, authentic student success proof, strong SEO, and simple content management.

----

## 2. Architecture & Technology Stack

The project must continue using a decoupled monorepo architecture with independent frontend and backend folders. This keeps the system scalable, secure, and easy to migrate to another infrastructure later.

### 2.1 Deployment Environment - Current Phase

| Layer | Current Platform | Notes |
|---|---|---|
| Frontend | Vercel | Next.js app deployment with SSR/SEO support |
| Backend | Render | Node.js + Express API deployment |
| Database | Supabase PostgreSQL | Structured data for courses, leads, users, tests, results, resources, and CMS |
| Storage | Supabase Object Storage | Images, brochures, PDFs, G-Books, answer keys, test assets, gallery media |
| CDN | Cloudflare | Recommended for fast media delivery across India |

**Portability constraint:** The codebase must remain platform-agnostic. Do not tightly couple business logic to Vercel, Render, or Supabase-specific APIs unless wrapped inside service modules. Future migration to AWS S3, EC2, RDS, CloudFront, or other providers should not require large rewrites.

### 2.2 Core Technology Stack

#### Frontend - `client/`

- **Framework:** Next.js with React 18 and App Router.
- **Styling:** Tailwind CSS with a strict design-token system.
- **Animation:** Framer Motion for sliders, counters, page transitions, and subtle scroll reveal effects.
- **Forms:** React Hook Form with Zod validation.
- **Data Fetching:** API service layer under `client/src/lib/api/`.
- **SEO:** Dynamic metadata, schema markup, sitemap generation, robots.txt, canonical URLs.
- **Media:** Optimized images, lazy loading, responsive image sizes, WebP where possible.

#### Backend - `server/`

- **Runtime:** Node.js with Express and TypeScript.
- **Database:** PostgreSQL.
- **ORM:** Sequelize with migrations and seeders.
- **Authentication:** JWT-based stateless authentication.
- **Authorization:** Strict Role-Based Access Control (RBAC).
- **Validation:** Zod or Joi on all incoming payloads.
- **Security:** Rate limiting, CORS configuration, input sanitization, centralized error handling.
- **File Handling:** Upload pipeline for images and PDFs through storage service abstraction.
- **Notifications:** Email, WhatsApp follow-up, and optional push notifications.

---
 
## 3. Repository Structure

Keep the project in a monorepo layout. Do not mix frontend UI code with backend business logic.

```text
<repo-root>/
├── client/                         # Next.js frontend application
│   ├── public/
│   │   ├── images/
│   │   │   └── logo.png            # Success Code Academy logo
│   │   └── assets/                 # Static icons, placeholders, OG images
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages and route groups
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── courses/
│   │   │   ├── scholarships/
│   │   │   ├── test-series/
│   │   │   ├── student-hub/
│   │   │   ├── results/
│   │   │   ├── blogs/
│   │   │   ├── reviews/
│   │   │   ├── gallery/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── faqs/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── home/               # Home page sections
│   │   │   ├── courses/            # Course cards, filters, comparison, quiz
│   │   │   ├── scholarships/       # Scholarship cards, detail sections, forms
│   │   │   ├── tests/              # Test series UI and analytics widgets
│   │   │   ├── resources/          # Answer keys, NCERT, G-Books, study material
│   │   │   ├── results/            # Topper cards, filters, stats
│   │   │   ├── blog/               # Blog cards, comments, categories
│   │   │   ├── gallery/            # Media grid and lightbox
│   │   │   ├── layout/             # Header, footer, widgets, shell
│   │   │   └── ui/                 # Reusable primitives
│   │   ├── data/                   # Temporary static data and typed fixtures
│   │   ├── hooks/                  # Reusable frontend hooks
│   │   ├── lib/                    # API clients, utilities, SEO helpers
│   │   ├── types/                  # Shared frontend TypeScript types
│   │   └── styles/                 # Global CSS and design tokens
│   ├── package.json
│   └── tsconfig.json
├── server/                         # Node.js, Express, TypeScript backend
│   ├── src/
│   │   ├── config/                 # env, database, app config
│   │   ├── controllers/            # route handlers
│   │   ├── middlewares/            # auth, validation, errors, rate limits
│   │   ├── models/                 # Sequelize models
│   │   ├── migrations/             # database migrations
│   │   ├── routes/                 # API route definitions
│   │   ├── services/               # business services and storage integrations
│   │   ├── utils/                  # helpers
│   │   └── index.ts                # Express entry point
│   ├── .env                        # local backend env, git-ignored
│   ├── package.json
│   └── tsconfig.json
├── README.md                       # this project context file
└── skills-lock.json
```

Generated directories such as `client/node_modules/`, `client/.next/`, `server/node_modules/`, and `server/dist/` must never be committed.

---

## 4. Website Sitemap

The website is divided into three major navigation groups.

| Primary Pages | Resource Pages | Utility Pages |
|---|---|---|
| Home | Student Hub | About Us |
| Courses | NCERT Solutions | Contact / Callback |
| Scholarships | Success Code Academy G-Books | Blogs & Reviews |
| Test Series | NEET Answer Key | Gallery |
| Results / Toppers | Study Material | FAQs |

Recommended route map:

```text
/
/courses
/courses/[slug]
/scholarships
/scholarships/[slug]
/test-series
/test-series/[slug]
/student-hub
/student-hub/neet-answer-key
/student-hub/ncert-solutions
/student-hub/g-books
/student-hub/study-material
/results
/blogs
/blogs/[slug]
/reviews
/gallery
/about
/contact
/faqs
/login
/dashboard
/admin
```

---

## 5. Page-by-Page Implementation Plan

## 5.1 Home Page - High Conversion Landing Page

The home page is the primary landing surface. It must immediately communicate credibility, urgency, and relevance to NEET aspirants and parents. It should guide visitors toward actions such as course exploration, callback request, and scholarship exam registration.

### Required Sections

1. **Hero / Banner Section**
   - Full-width animated banner.
   - Tagline such as `India's Most Trusted NEET Coaching`.
   - Primary CTAs: `Explore Courses`, `Request a Callback`, `Register for Scholarship Exam`.
   - Countdown timer for upcoming scholarship exam or course deadline.
   - Auto-rotating banner for top results, new batches, and scholarship dates.

2. **Top Results - AIIMS / NEET Toppers**
   - Student photo, name, rank, and score.
   - Filter by year and exam type.
   - Link to full Results / Toppers page.

3. **Announcement Ticker**
   - Horizontal ticker or notification bar.
   - Must support scholarship dates, registration openings, counselling deadlines, and results.
   - Dismissible notifications.
   - Admin-manageable from CMS.

4. **Trending Things**
   - Card grid for new courses, test series launches, mock test schedules, scholarship updates, and result announcements.
   - Tag filters: Course, Test Series, Scholarship, Result.
   - View count or trending badge.

5. **Meet Our Stars**
   - Student success stories with photo, quote, rank, and course attended.
   - Optional video testimonials.
   - Carousel or horizontal scroll on mobile.

6. **Student Reviews & Blogs Preview**
   - Latest 3 blogs with thumbnail, title, date, and read time.
   - Aggregate star rating from reviews.
   - CTAs: `Read All Blogs`, `See All Reviews`.

7. **Explore Courses & Request a Callback**
   - Course category chips: NEET 11th, NEET 12th, Repeater, Foundation.
   - Enroll counts per course category.
   - Persistent callback form with name, phone, and course interest.
   - Sticky/floating callback button on scroll.

8. **Trust Bar**
   - Students Enrolled.
   - Years of Experience.
   - Success Rate.
   - Toppers Produced.
   - Animated counters on scroll.

---

## 5.2 Courses Page

The Courses page must help parents and students understand available programs, compare options, and take action.

### Course Categories

| Course | Purpose |
|---|---|
| NEET 11th | For Class 11 students starting NEET preparation early |
| NEET 12th | Intensive batch for Class 12 students targeting the upcoming NEET exam |
| NEET Repeater | For droppers aiming for a stronger rank |
| Foundation Course | For Class 8-10 students building a science base for NEET |

### Course Listing Requirements

- Course cards with title, class level, duration, mode, fee teaser, next batch date, and CTA.
- Search and filters by batch type, fee range, duration, and mode.
- Course comparison tool allowing selection of 2-3 courses.
- `Find the Right Course` quiz with 3-4 questions and a course recommendation.

### Course Detail Page Requirements

Each `/courses/[slug]` page must include:

- Course overview.
- Batch schedule.
- Faculty list.
- Demo video.
- Subject-wise syllabus breakdown.
- Fee structure with installment options.
- `Enroll Now` CTA with payment gateway integration.
- `Download Brochure` button.
- `Talk to an Expert` CTA opening chat or callback.
- Course-specific FAQ accordion.
- Student reviews for the course.

---

## 5.3 Scholarships Page

The Scholarships page is a high-conversion page focused on registrations for the institute's scholarship exam.

### Scholarship Listing

- Scholarship cards with name, eligibility summary, reward teaser, and `Register Now` CTA.
- Filters by class and category.
- Urgency indicators such as countdown timer and seats remaining.

### Scholarship Exam Detail Page

Each `/scholarships/[slug]` page must include:

| Section | Requirement |
|---|---|
| Venue | Exam centre address with map embed |
| Date & Time | Exam date, reporting time, and result announcement date |
| Mode of Exam | Online, Offline, or Hybrid |
| Duration | Total exam time in hours and minutes |
| Availability | Seats remaining with live database count |
| Eligibility Criteria | Class, marks percentage, and age requirements |
| Scholarship Rewards | Fee waiver or cash prize for each rank band, valid for 30 days |
| How to Register | Step-by-step guide with screenshots |

### Scholarship Preparation

- Syllabus download.
- Sample papers.
- Previous year papers.
- Link to relevant test series.
- Faculty video tips.

### Scholarship Achievements

- Past scholarship winners with rank, photo, and reward received.
- Total scholarship value awarded to date.

### Scholarship FAQs

- Accordion-style FAQ specific to the scholarship exam.

---

## 5.4 Test Series Page

The Test Series page must sell and deliver mock tests and full test series packages for both enrolled and non-enrolled students.

### Test Series Categories

| Category | Requirement |
|---|---|
| NEET 11th | Subject-wise and full-syllabus tests for Class 11 students |
| NEET 12th | Full-length NEET mock tests aligned with NTA pattern |
| Foundation Tests | Science and maths fundamentals for Class 8-10 |
| Mock Test - Free | 1-2 free sample tests available without login to drive sign-ups |

### Test Series Detail Page

Each `/test-series/[slug]` page must include:

- Number of tests.
- Frequency.
- Subjects covered.
- Sample test preview with first 5 questions.
- Performance analytics: rank, percentile, chapter-wise accuracy.
- Solution PDFs and video explanations.
- Leaderboard showing top scorers across batches.
- Purchase button with payment gateway.
- Instant access after successful payment.

### Student Test Dashboard

Authenticated students must see:

- Upcoming and completed tests timeline.
- Scorecards.
- Strong and weak chapter analysis.
- Rank prediction based on test performance.
- Solution downloads and video explanations.

---

## 5.5 Student Hub

The Student Hub is a dedicated NEET resource centre. It must be accessible to all visitors, while premium content is gated for enrolled students.

### NEET Answer Key

- Year-wise and set-wise answer keys.
- Downloadable answer key PDFs.
- Full solutions in text and video.
- Rank predictor: input score and get estimated rank range.
- College predictor: input rank and see likely college options using NMC data.
- Score calculator: mark correct/incorrect and get expected marks.
- OMR sheet images for reference.

### NCERT Solutions

- Class 11 and 12 Physics, Chemistry, and Biology chapter-wise solutions.
- Search by chapter and topic.
- Online view mode.
- PDF download option.

### Success Code Academy G-Books

- Proprietary study material as digital books.
- In-browser PDF viewer.
- Bookmarking.
- Download access for enrolled students.
- Preview-only mode for guests.

### Study Material

- NEET previous year question papers for 10+ years.
- Biology diagrams and revision notes.
- Formula sheets for Physics and Chemistry.
- Daily Practice Problems archive.

---

## 5.6 Results / Toppers Page

The Results page is a credibility and social proof engine.

Required features:

- Year-wise toppers gallery.
- Photo, name, rank, score, and course attended.
- Filter by year, exam type, and rank range.
- Aggregate stats: total selections, AIR under 100, AIR under 1000.
- Video interviews of toppers.
- Social share button on each topper card.

---

## 5.7 Blogs & Reviews

### Blog Section

- Blog category filters: Study Tips, NEET News, Exam Strategy, Biology, Chemistry, Physics.
- Author, date, read time, and tags.
- Related posts at the bottom of each blog.
- Moderated comment section.
- Social share buttons for WhatsApp, Instagram, and LinkedIn.

### Student Reviews

- Star rating and written review submission form.
- Logged-in students only for direct review submission.
- Google Reviews integration widget.
- Filters by course, batch year, and rating.
- Admin moderation before publishing internal reviews.

---

## 5.8 Gallery

- Photo and video gallery.
- Categories: Classroom Sessions, Events, Result Celebrations, Seminars.
- Lightbox viewer with navigation arrows.
- Video thumbnails with embedded YouTube or Vimeo player.
- CMS-managed upload, category, title, alt text, and publish status.

---

## 5.9 About Us Page

- Institute history.
- Mission and vision.
- Faculty profiles with photo, qualifications, and experience.
- Infrastructure photos of labs, library, classrooms, and campus spaces.
- Awards, recognitions, and media mentions.

---

## 5.10 Contact & Request a Callback

### Essential Elements of Your Contact Page

- Interactive contact form with name, phone, email, city, course interest, message, and preferred callback time.
- Embedded map (Google Maps or Mapbox) showing institute location with a smooth entrance animation and custom pin.
- Visible side panel next to the form with institute classroom or campus imagery to reinforce trust.
- Subtle motion and scroll-triggered animation for the form, map, and side panel.
- Live chat through WhatsApp Business or Tawk.to.
- Branch selector if multiple centres are added.
- Expected callback time message such as `We call back within 2 hours`.
- Lead must be stored in database and trigger notification to the admissions team.

---

## 5.11 FAQs

- General institute FAQs.
- Course-specific FAQs.
- Scholarship-specific FAQs.
- Payment and refund FAQs.
- Student portal and test series FAQs.
- FAQ schema markup for SEO.

---

## 6. Interactive & Engagement Features

| Feature | Description | Priority |
|---|---|---|
| Sticky Callback Button | Floating phone/WhatsApp icon on all pages | High |
| Live Chat | WhatsApp Business or Tawk.to widget | High |
| Rank Predictor Tool | Input NEET score and get estimated rank plus college list | High |
| Countdown Timers | Scholarship exam, course deadline, and result date timers | High |
| Search Bar | Site-wide search for blogs, courses, resources | High |
| Notification Bell | Push notifications for results, exams, and deadlines | Medium |
| Course Recommender Quiz | 3-question quiz to suggest the right course | Medium |
| Progress Tracker | Student portal test scores and study streaks | Medium |
| Video Pop-ups | Muted topper testimonial video on first visit | Medium |
| Exit Intent Pop-up | Offer free mock test or callback before exit | Medium |
| Dark Mode Toggle | User preference for dark/light display | Low |
| Social Proof Ticker | Live feed of enrollments such as `A student from Pune just enrolled` | Low |

Implementation note: High-priority features must be completed before polishing low-priority visual features.

---

## 7. Student Login Portal

A secure post-enrollment dashboard for registered students.

### Authentication

- Phone OTP login through Msg91 or Firebase.
- Optional Google SSO.
- JWT session after verification.
- Role-based dashboard routing.

### Student Dashboard Features

- Enrolled courses.
- Test schedule.
- Test scores and performance analytics.
- Access to G-Books and study material.
- Fee payment history.
- Receipt downloads.
- Test series access.
- Doubt submission form.
- Faculty response tracker.
- Attendance records for classroom courses, if applicable.
- Notifications and announcements from the institute.

---

## 8. Admin / CMS Requirements

The admin panel must allow non-technical staff to manage the website without developer involvement.

### CMS Features

- Add, edit, remove course listings and fees.
- Upload and replace course brochures.
- Upload topper results with photos.
- Manage scholarship exam dates, venues, modes, rewards, and seats.
- Publish, schedule, and archive blog posts.
- View, search, and export callback request leads.
- Update announcement ticker messages.
- Moderate student reviews and comments.
- Upload test series data and manage access permissions.
- Upload answer keys, NCERT solutions, G-Books, and study material.
- Manage gallery media and categories.
- Update global institute data such as phone, email, address, social links, and callback timing.
- Analytics dashboard for page visits, lead conversions, and most-viewed courses.

### Admin Roles

| Role | Permissions |
|---|---|
| Super Admin | Full access, user management, settings, all CMS modules |
| Editor | Blogs, announcements, gallery, reviews moderation |
| Admissions | Leads, callbacks, scholarship registrations, enquiry exports |
| Academic Staff | Test series, answer keys, study material, G-Books, doubt responses |
| Analyst | Read-only analytics and reports |

---

## 9. Backend Modules & Data Models

The following backend domains should be implemented as separate modules.

### Core Models

| Model | Purpose |
|---|---|
| User | Student, admin, editor, admissions, academic staff accounts |
| Role | RBAC role definition |
| Permission | Fine-grained access control |
| StudentProfile | Student class, city, enrolled course, contact details |
| Course | NEET 11th, NEET 12th, Repeater, Foundation course data |
| CourseBatch | Batch schedule, mode, seats, faculty, start date |
| CourseFAQ | FAQs linked to course pages |
| CourseReview | Student reviews linked to courses |
| Brochure | Course brochure PDF metadata |
| Scholarship | Scholarship exam listing and detail data |
| ScholarshipRegistration | Student registration for scholarship exam |
| ScholarshipWinner | Past scholarship winners and rewards |
| TestSeries | Test series packages and pricing |
| Test | Individual tests inside a series |
| Question | Test questions and options |
| TestAttempt | Student attempts and responses |
| TestAnalytics | Rank, percentile, accuracy, strong/weak chapter data |
| AnswerKey | NEET answer key PDFs and metadata |
| NCERTSolution | Subject, class, chapter, topic-wise solutions |
| GBook | Success Code Academy digital books |
| StudyMaterial | Papers, notes, formula sheets, DPP archives |
| TopperResult | Topper profile, score, rank, year, exam |
| BlogPost | Blog content, category, tags, author, SEO data |
| BlogComment | Moderated comments |
| Review | Student review and rating data |
| GalleryMedia | Photos, videos, categories, alt text |
| Lead | Callback, contact, enquiry, and course-interest leads |
| Announcement | Ticker and notification messages |
| Payment | Course or test series purchase records |
| Receipt | Downloadable fee receipts |
| Notification | Student/admin notifications |
| Doubt | Student doubt submissions |
| DoubtResponse | Faculty replies to student doubts |
| Attendance | Classroom course attendance records |
| SiteSetting | Global contact details, social links, SEO defaults |

### API Design Rules

- Use `/api/v1` prefix.
- All public form endpoints must be rate-limited.
- Validate every request body with Zod/Joi before controller logic.
- Never expose admin-only data in public endpoints.
- All CMS mutations must require authentication and RBAC authorization.
- File upload endpoints must validate type, size, and ownership.
- Use pagination for all list endpoints.
- Add search, filter, and sort query support where needed.

### Example API Routes

```text
GET    /api/v1/courses
GET    /api/v1/courses/:slug
POST   /api/v1/leads/callback
POST   /api/v1/scholarships/:id/register
GET    /api/v1/test-series
GET    /api/v1/student-hub/answer-keys
GET    /api/v1/results
GET    /api/v1/blogs
POST   /api/v1/reviews
POST   /api/v1/auth/otp/request
POST   /api/v1/auth/otp/verify
GET    /api/v1/students/me/dashboard
GET    /api/v1/admin/leads
POST   /api/v1/admin/courses
PATCH  /api/v1/admin/courses/:id
DELETE /api/v1/admin/courses/:id
```

---

## 10. SEO, Performance & Technical Requirements

| Requirement | Target |
|---|---|
| Mobile Responsiveness | Fully responsive on all screen sizes from 320px and above |
| Page Load Speed | Core Web Vitals target: LCP < 2.5s, CLS < 0.1, FID < 100ms |
| SEO | Meta titles, descriptions, canonical URLs, Open Graph tags, schema markup |
| Schema Markup | FAQPage, Course, LocalBusiness, BlogPosting, Review where relevant |
| HTTPS / SSL | Mandatory for all pages |
| Analytics | Google Analytics 4 and Google Search Console integration |
| Sitemap & Robots | Auto-generated XML sitemap and proper robots.txt |
| Accessibility | WCAG 2.1 AA, alt text, keyboard navigation, colour contrast |
| Payment Gateway | Razorpay or Paytm for courses and test series |
| OTP Auth | Msg91 or Firebase phone OTP |
| WhatsApp API | WhatsApp Business API for automated lead follow-ups |
| CDN | Cloudflare CDN for fast media delivery across India |
| Database | Scalable PostgreSQL backend for tests, leads, CMS, and student portal |

### SEO Page Targets

- Home page: Success Code Academy brand, NEET coaching, admissions, results.
- Courses: NEET 11th coaching, NEET 12th coaching, NEET repeater batch, foundation course.
- Scholarships: scholarship exam, fee waiver, registration deadline.
- Test Series: NEET mock test, test series, NTA pattern practice.
- Student Hub: NEET answer key, NCERT solutions, study material, G-Books.
- Results: NEET toppers, AIR results, success stories.
- Blogs: NEET preparation strategy, subject guides, exam news.

---

## 11. Design & Branding Guidelines

| Element | Guideline |
|---|---|
| Primary Colour | `#2C3E7A` Deep Blue for headers, CTAs, and navigation |
| Accent Colour | `#E8490F` Orange-Red for buttons, highlights, and tickers |
| Background | `#FFFFFF` and `#F7F9FC` for clean, airy layouts |
| Typography | Headings: Poppins Bold; Body: Inter Regular; fallback: Arial |
| Imagery | Use real student photos; avoid generic stock images |
| Buttons | 8px rounded corners, solid fill for primary, outline for secondary |
| Icons | Use one consistent set, preferably Phosphor or Heroicons |
| Spacing | Generous whitespace and card-based layouts |
| Animation | Subtle scroll-triggered fade-ins; avoid excessive motion |

### UI Tone

- Trustworthy, focused, and premium.
- Parent-friendly and student-friendly.
- Avoid clutter.
- Every page should have a clear next action.
- Use authentic student results and real classroom imagery wherever possible.

---

## 12. Forms, Leads & Conversion Rules

### Public Forms

- Callback form.
- Contact form.
- Course enquiry form.
- Scholarship registration form.
- Review submission form.
- Doubt submission form for logged-in students.

### Form Requirements

- Validate name, phone, email, city, and course interest.
- Phone number is mandatory for callback and scholarship forms.
- Store all submissions in the database.
- Send notification to admissions/admin team.
- Show success state with clear next step.
- Prevent spam using rate limiting and optional CAPTCHA.
- Allow admin export to CSV or Excel.

### Conversion Rules

- Main CTA must be visible above the fold on home, courses, scholarships, and test series pages.
- Sticky callback/WhatsApp action must be present site-wide.
- Scholarship pages should include urgency: seats remaining, deadline, countdown.
- Course pages should include brochure download and expert callback.
- Test series pages should include free sample preview to encourage signup.

---

## 13. Payment & Access Control

### Payment Use Cases

- Course enrollment.
- Test series purchase.
- Optional scholarship registration fee if required later.

### Required Flow

1. User selects course or test series.
2. Backend creates payment order.
3. Razorpay/Paytm checkout is opened.
4. Payment callback/webhook verifies transaction.
5. Access is granted only after verified payment.
6. Receipt is generated and visible in student dashboard.

### Access Control

- Guests can preview selected content.
- Logged-in students can access enrolled content.
- Paid test series content must be locked until purchase.
- G-Books are downloadable only for enrolled students; guests get preview-only mode.
- Admin-only routes must never be reachable without RBAC checks.

---

## 14. Implementation Phases

| Phase | Scope | Timeline |
|---|---|---|
| Phase 1 - Launch | Home, Courses, Scholarships, Results, Contact, Blog | 6-8 weeks |
| Phase 2 - Engagement | Test Series, Student Hub, Gallery, Reviews, Student Portal | 4-6 weeks |
| Phase 3 - Intelligence | Rank Predictor, Course Quiz, Push Notifications, Admin CMS | 4-6 weeks |
| Phase 4 - Scale | PWA, WhatsApp bot, Advanced Analytics, Multi-branch support | Ongoing |

### Phase 1 Build Order

1. Design system and layout shell.
2. Header, footer, WhatsApp widget, sticky callback.
3. Home page sections.
4. Courses listing and course detail pages.
5. Scholarships listing and detail/register flow.
6. Results / Toppers page.
7. Contact and callback lead flow.
8. Blog listing and blog detail.
9. Basic CMS seed/admin endpoints for launch content.

### Phase 2 Build Order

1. Test series listing and details.
2. Student Hub resource pages.
3. Answer key, NCERT solutions, G-Books, study material modules.
4. Gallery with lightbox.
5. Reviews with moderation.
6. Student login and dashboard.

### Phase 3 Build Order

1. Rank predictor.
2. College predictor.
3. Course recommender quiz.
4. Notification bell and push notifications.
5. Full admin CMS dashboard.
6. Analytics dashboard.

### Phase 4 Build Order

1. PWA support.
2. WhatsApp automation bot.
3. Advanced conversion analytics.
4. Multi-branch support.
5. Infrastructure migration readiness.

---

## 15. Development Standards

### Frontend Standards

- Use reusable components instead of duplicating UI.
- Keep page sections modular.
- Use typed props for every component.
- Keep static/mock content inside typed data files until APIs are ready.
- Use semantic HTML for SEO and accessibility.
- Add loading, empty, and error states for all dynamic content.
- Use responsive design from the start.

### Backend Standards

- Use service-controller-route separation.
- Keep business logic out of route files.
- Use migrations for schema changes.
- Use environment variables for secrets and external service keys.
- Add centralized error handling.
- Add request validation before database operations.
- Add logging for important admin and payment actions.

### Security Standards

- Never commit `.env` files.
- Never expose service keys in frontend code.
- Rate-limit all public submission endpoints.
- Sanitize user-generated content before display.
- Use secure password hashing for admin users.
- Validate file uploads by MIME type and extension.
- Restrict CMS actions by role.
- Verify payment webhooks server-side.

---

## 16. Testing & Quality Checklist

Before any production deployment, verify:

- All key pages are responsive from 320px mobile width to desktop.
- Forms validate correctly and store data.
- Callback lead notifications work.
- Course and scholarship CTAs work.
- CMS changes reflect on frontend pages.
- Image uploads and PDF downloads work.
- SEO metadata appears correctly.
- Sitemap and robots.txt are generated.
- Lighthouse performance is acceptable.
- Keyboard navigation works.
- Payment flow is verified in test mode.
- Auth and role restrictions are working.
- No secrets are exposed in the frontend bundle.

---

## 17. Environment Variables

Use separate `.env` files for client and server.

### Client

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

### Server

```env
NODE_ENV=
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
MSG91_AUTH_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
ADMIN_NOTIFICATION_EMAIL=
CORS_ORIGIN=
```

Never hardcode secrets, keys, phone numbers, or email addresses directly inside components.

---

## 18. AI Agent Implementation Instructions

When building this project, follow these rules:

1. Treat this README as the primary implementation context.
2. Build according to the final Success Code Academy NEET plan, not the older generic academy structure.
3. Keep `client/` and `server/` strictly separated.
4. Do not remove existing working files unless replacing them with better equivalents.
5. Prefer incremental implementation with clear commits.
6. Implement Phase 1 first unless explicitly instructed otherwise.
7. Use temporary typed mock data only when backend APIs are not ready.
8. Keep all future CMS-managed content structured so it can be moved into the database later.
9. Use the official brand colours and typography from this README.
10. Every public page should include a clear conversion path: course exploration, callback, scholarship registration, or WhatsApp contact.
11. Do not overbuild low-priority features before high-priority features are functional.
12. Ensure mobile responsiveness before adding advanced animations.
13. Preserve SEO structure while building dynamic pages.
14. Use real content fields and CMS-friendly schema naming, not placeholder-only data structures.

---

## 19. Definition of Done

A feature is complete only when:

- It matches the specified page or module requirements.
- It is responsive on mobile, tablet, and desktop.
- It has loading, empty, and error states where applicable.
- It uses validated data and typed interfaces.
- It is SEO-friendly if publicly visible.
- It can be managed from CMS if marked as CMS content.
- It does not break existing routes or layout.
- It follows the Success Code Academy brand guidelines.
- It has been manually tested in the browser.

---

## 20. Final Product Direction

Success Code Academy should feel like a premium NEET-focused platform with strong trust signals, fast access to student resources, and frictionless lead capture.

The end product must help three groups clearly:

- **Students:** find courses, tests, answer keys, solutions, G-Books, and performance insights.
- **Parents:** trust the institute through results, reviews, faculty, infrastructure, and clear callback options.
- **Staff/Admins:** update content, manage leads, publish resources, and track conversions without developer help.

**Success Code Academy - Empowering NEET Aspirants**
