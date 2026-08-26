# 🏆 Success Code Academy — Master Project Documentation

> **Domain:** [successcodeacademy.in](https://www.successcodeacademy.in)
> **Status:** ✅ Fully Completed & Published (Live in Production)
> **Last Updated:** August 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Frontend — `client/`](#5-frontend--client)
6. [Backend — `server/`](#6-backend--server)
7. [Database — Models & Migrations](#7-database--models--migrations)
8. [API Routes & Endpoints](#8-api-routes--endpoints)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Admin Panel & Visual Website Editor](#10-admin-panel--visual-website-editor)
11. [Website Pages & Features](#11-website-pages--features)
12. [Design System & Branding](#12-design-system--branding)
13. [SEO & Performance](#13-seo--performance)
14. [Deployment & Infrastructure](#14-deployment--infrastructure)
15. [Hosting & Infrastructure Services](#15-hosting--infrastructure-services)
16. [Messaging & Notification Services](#16-messaging--notification-services)
17. [Environment Variables Reference](#17-environment-variables-reference)
18. [Getting Started — Local Development](#18-getting-started--local-development)
19. [Development Standards & Security](#19-development-standards--security)
20. [Implementation](#20-implementation)

---

## 1. Project Overview

Success Code Academy is a **NEET coaching institute** based in **Baramati, Maharashtra, India**. This website is a **complete, modern, production-grade platform** designed to:

| Goal | Description |
|------|-------------|
| **Primary** | Drive course enrollments, scholarship exam registrations, and callback/enquiry requests |
| **Secondary** | Build credibility and trust through NEET toppers' results, student reviews, blogs, study resources, and gallery |
| **Admin** | Enable non-technical staff to manage all website content without developer involvement |
| **Student** | Provide enrolled students with a secure dashboard for test results, study materials, and downloads |

### Target Audience

| Segment | Description |
|---------|-------------|
| NEET Aspirants | Class 11, Class 12, Repeater, and Foundation-level students |
| Parents | Decision-makers evaluating coaching options |
| Staff/Admins | Institute administrators managing content, leads, and operations |

### Key Tagline

> *"Baramati's top NEET coaching institute. Home to this year's AIR 5 NEET topper and outstanding medical entrance results."*

---

## 2. High-Level Architecture

The project uses a **decoupled monorepo** architecture with independent frontend and backend codebases. This keeps the system scalable, secure, and portable across hosting providers.

```
┌──────────────────────────────────────────────────────────────────┐
│                         VISITORS / STUDENTS                      │
│                    (Browser / Mobile Device)                      │
└──────────────┬───────────────────────────┬───────────────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────┐     ┌──────────────────────────────┐
│   Frontend (Vercel)  │────▶│   Backend API (Render)       │
│   Next.js + React 19 │     │   Node.js + Express 5        │
│   SSR / Static Pages │     │   TypeScript                 │
│   Port: 3000 (dev)   │     │   Port: 5000 (dev)           │
└──────────────────────┘     └──────────┬───────────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │   Supabase (Cloud)          │
                          │                            │
                          │   PostgreSQL Database      │
                          │   Object Storage (images,  │
                          │   PDFs, brochures, media)  │
                          │   Daily Backups (Pro Plan) │
                          └────────────────────────────┘
```

**Portability Constraint:** Business logic is NOT tightly coupled to Vercel, Render, or Supabase-specific APIs. Storage and database access are wrapped in service modules so future migration to AWS (S3, EC2, RDS, CloudFront) or other providers requires minimal rewrites.

---

## 3. Technology Stack

### Frontend (`client/`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.9 | React framework with App Router, SSR, and SEO support |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Framer Motion** | 12.41.0 | Animations — sliders, counters, page transitions, scroll reveals |
| **Lucide React** | 1.21.0 | Icon library |
| **React Icons** | 5.6.0 | Additional icon sets |
| **CSS Modules + Vanilla CSS** | — | Component-scoped and global styling with design tokens |
| **next-sitemap** | 4.2.3 | Automatic XML sitemap and robots.txt generation |
| **Inter (Google Font)** | — | Primary typeface via `next/font` |

### Backend (`server/`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js + Express** | 5.2.1 | HTTP server and REST API framework |
| **TypeScript** | 6.0.3 | Type safety |
| **Sequelize** | 6.37.8 | PostgreSQL ORM with migrations and seeders |
| **PostgreSQL (pg)** | 8.22.0 | Database driver |
| **Zod** | 4.4.3 | Request payload validation |
| **JSON Web Token** | 9.0.3 | JWT-based stateless authentication |
| **bcrypt** | 6.0.0 | Password hashing |
| **helmet** | 8.2.0 | Security headers |
| **cors** | 2.8.6 | Cross-origin request handling |
| **express-rate-limit** | 8.5.2 | Rate limiting (100/15min global, 10/15min forms) |
| **multer** | 2.2.0 | File upload handling |
| **winston** | 3.19.0 | Structured logging |
| **@supabase/supabase-js** | 2.110.7 | Supabase storage integration |
| **dotenv** | 17.4.2 | Environment variable loading |
| **nodemon** | 3.1.14 | Dev hot-reload |
| **sequelize-cli** | 6.6.5 | Migration CLI |

### Infrastructure & Services

| Service | Role | Plan |
|---------|------|------|
| **Vercel** | Frontend hosting (SSR/SEO) | Hobby / Free (upgrade to Pro at scale) |
| **Render** | Backend API hosting (always-on) | Starter ($7/mo) |
| **Supabase** | PostgreSQL database + object storage | Pro ($25/mo) |
| **Cloudflare** | CDN for fast media delivery across India | Recommended |
| **MSG91** | SMS OTP and WhatsApp notifications | Pay-per-use |

---

## 4. Repository Structure

```
success-code-academy/                     # Monorepo root
│
├── Master_README.md                       # ← This file
├── README.md                              # Feature specification / AI context doc (938 lines)
├── ADMIN_GUIDE.md                         # Non-technical staff admin guide
├── Success_Code_Academy_Project_Summary_and_Costs.pdf  # Client-facing project & cost summary
├── AGENTS.md                              # AI agent rules (graphify integration)
├── .gitignore                             # Root gitignore
├── skills-lock.json                       # Agent skills lock
│
├── client/                                # ──── FRONTEND (Next.js 16) ────
│   ├── .env.local                         # Local env (NEXT_PUBLIC_API_URL)
│   ├── .vercelignore                      # Vercel deployment ignores
│   ├── next.config.ts                     # Next.js config (redirects, images, Supabase remote patterns)
│   ├── next-sitemap.config.js             # Sitemap generation config (successcodeacademy.in)
│   ├── tsconfig.json                      # TypeScript config
│   ├── eslint.config.mjs                  # ESLint config
│   ├── package.json                       # Dependencies & scripts
│   ├── replacePaths.js                    # Build-time path replacement utility
│   │
│   ├── public/                            # Static assets
│   │   ├── images/                        # Organized image assets
│   │   │   ├── about/                     # About page imagery
│   │   │   ├── banners/                   # Hero banners
│   │   │   ├── blogs/                     # Blog thumbnails
│   │   │   ├── courses/                   # Course imagery
│   │   │   ├── crops/                     # Cropped image variants
│   │   │   ├── infra/                     # Infrastructure/campus photos
│   │   │   ├── press/                     # Press/media coverage
│   │   │   ├── results/                   # Results page imagery
│   │   │   ├── stars/                     # Star student photos
│   │   │   └── ui/                        # UI icons & decorative elements
│   │   ├── documents/                     # Downloadable PDFs & documents
│   │   ├── videos/                        # Static video assets
│   │   ├── sitemap.xml                    # Generated sitemap index
│   │   ├── sitemap-0.xml                  # Generated sitemap entries
│   │   └── robots.txt                     # SEO robots.txt
│   │
│   └── src/
│       ├── middleware.ts                   # Next.js middleware (maintenance mode)
│       │
│       ├── app/                           # ── App Router ──
│       │   ├── layout.tsx                 # Root layout (Inter font, admin theme script, metadata)
│       │   ├── globals.css                # Global CSS resets
│       │   ├── public.css                 # Public site styles (28KB)
│       │   ├── live-editor.css            # Visual editor overlay styles
│       │   ├── loading.tsx                # Global loading skeleton
│       │   ├── not-found.tsx              # Custom 404 page
│       │   ├── icon.png                   # Favicon
│       │   ├── registry.tsx               # Styled-JSX registry
│       │   │
│       │   ├── (main)/                    # ── Public Route Group ──
│       │   │   ├── layout.tsx             # Public layout (Header + Footer + WhatsApp)
│       │   │   ├── page.tsx               # → / (redirects to /home)
│       │   │   ├── home/                  # → /home (home page)
│       │   │   │   ├── HomeClient.tsx     # Main home page client component (17.6KB)
│       │   │   │   ├── ToppersCarousel.tsx # Toppers slider component
│       │   │   │   ├── ExploreCourses.tsx  # Course exploration section
│       │   │   │   ├── AcademyInsights.tsx # Academy insights section (20.2KB)
│       │   │   │   ├── WhySCA.tsx         # "Why SCA" value propositions
│       │   │   │   ├── ParentsTrustUs.tsx # Social proof / parents section
│       │   │   │   ├── home.css           # Home page styles (65.3KB)
│       │   │   │   └── Toppers.jpg        # Toppers image asset
│       │   │   ├── courses/               # → /courses
│       │   │   │   ├── page.tsx           # Courses listing page
│       │   │   │   ├── CoursesClient.tsx  # Course listing client component (34.7KB)
│       │   │   │   ├── courses.css        # Courses listing styles
│       │   │   │   ├── course-detail.css  # Course detail styles
│       │   │   │   └── [id]/             # → /courses/[id] (dynamic course detail)
│       │   │   ├── admissions/            # → /admissions
│       │   │   │   ├── page.tsx           # Admissions page
│       │   │   │   ├── AdmissionsClient.tsx # Admissions client component (40.4KB)
│       │   │   │   └── admissions.css     # Admissions styles
│       │   │   ├── results/               # → /results
│       │   │   │   ├── page.tsx           # Results page
│       │   │   │   ├── ResultsClient.tsx  # Results client component (18.4KB)
│       │   │   │   └── results.css        # Results styles (33.5KB)
│       │   │   ├── about/                 # → /about
│       │   │   │   ├── page.tsx           # About page (16.8KB)
│       │   │   │   └── about.css          # About styles
│       │   │   ├── contact/               # → /contact
│       │   │   │   ├── page.tsx           # Contact page
│       │   │   │   ├── ContactClient.tsx  # Contact client component (39.6KB)
│       │   │   │   ├── contact.css        # Contact styles
│       │   │   │   └── contact_hero.png   # Contact page hero image
│       │   │   ├── gallery/               # → /gallery
│       │   │   │   └── page.tsx           # Gallery page (60.8KB)
│       │   │   └── faq/                   # → /faq
│       │   │       ├── page.tsx           # FAQ page
│       │   │       ├── FaqClient.tsx      # FAQ client component
│       │   │       ├── faq-data.ts        # FAQ question data (15.5KB)
│       │   │       └── faq.css            # FAQ styles
│       │   │
│       │   ├── admin/                     # ── Admin Dashboard ──
│       │   │   ├── layout.tsx             # Admin layout (auth guard, sidebar, dark mode)
│       │   │   ├── page.tsx               # Admin dashboard home
│       │   │   ├── admin.css              # Admin styles (50.7KB)
│       │   │   ├── login/                 # → /admin/login
│       │   │   ├── banners/               # → /admin/banners
│       │   │   ├── notifications/         # → /admin/notifications
│       │   │   ├── results/               # → /admin/results
│       │   │   ├── settings/              # → /admin/settings
│       │   │   ├── content/               # → /admin/content
│       │   │   ├── database/              # → /admin/database
│       │   │   └── reset-password/        # → /admin/reset-password
│       │   │
│       │   ├── api/                       # ── Next.js API Routes (Proxy) ──
│       │   │   ├── admin/                 # Admin API proxy routes
│       │   │   │   ├── [...path]/         # Catch-all admin API proxy
│       │   │   │   └── session/           # Session management
│       │   │   ├── content/               # Content API proxy
│       │   │   │   └── [pageKey]/         # Dynamic content by page key
│       │   │   └── public/                # Public API proxy
│       │   │       └── [...path]/         # Catch-all public API proxy
│       │   │
│       │   ├── maintenance/               # Maintenance mode page
│       │   ├── privacy-policy/            # Privacy policy page
│       │   └── terms/                     # Terms & conditions page
│       │
│       ├── components/
│       │   ├── layout/                    # ── Layout Components ──
│       │   │   ├── Header.tsx             # Site header/navigation (32.5KB)
│       │   │   ├── Footer.tsx             # Site footer (23KB)
│       │   │   ├── WhatsAppWidget.tsx     # Floating WhatsApp chat widget
│       │   │   ├── CookieConsent.tsx      # Cookie consent banner
│       │   │   └── AnimatedBackground.tsx # Animated background effects
│       │   │
│       │   ├── ui/                        # ── Reusable UI Primitives ──
│       │   │   ├── Button.tsx + Button.module.css
│       │   │   ├── Card.tsx + Card.module.css
│       │   │   ├── IconButton.tsx + IconButton.module.css
│       │   │   ├── PageHeader.tsx + PageHeader.module.css
│       │   │   ├── SectionHeading.tsx + SectionHeading.module.css
│       │   │   ├── SignInModal.tsx         # Student sign-in modal (18.4KB)
│       │   │   └── ProfileModal.tsx       # User profile modal (14.8KB)
│       │   │
│       │   ├── admin/                     # ── Admin Components (19 files) ──
│       │   │   ├── AdminContentManager.tsx    # Master content manager (22.6KB)
│       │   │   ├── AdminLeadTable.tsx         # Lead/enquiry table with export
│       │   │   ├── AdminModal.tsx             # Reusable admin modal
│       │   │   ├── AdminSessionContext.tsx     # Admin session React context
│       │   │   ├── AdminUi.tsx                # Admin UI shell
│       │   │   ├── BannerEditor.tsx           # Banner CRUD with image upload (10.9KB)
│       │   │   ├── CourseEditor.tsx            # Course CRUD editor
│       │   │   ├── EditModeContext.tsx         # Live edit mode context
│       │   │   ├── EditableSection.tsx         # Inline section editing
│       │   │   ├── EditableText.tsx            # Inline text editing
│       │   │   ├── LeadsDrawer.tsx             # Side drawer for leads management
│       │   │   ├── LiveContentContext.tsx      # Live content state management
│       │   │   ├── LiveContentDialog.tsx       # Live content editing dialog
│       │   │   ├── LiveEditorToolbar.tsx       # Editor toolbar (edit/preview toggle)
│       │   │   ├── NotificationEditor.tsx      # Announcement/notification editor (14.8KB)
│       │   │   ├── ResultEditor.tsx            # Topper result editor
│       │   │   ├── RevisionHistoryButton.tsx   # Content revision history viewer
│       │   │   ├── SettingsEditor.tsx          # Global site settings editor
│       │   │   └── StarStudentEditor.tsx       # Star student profile editor (11KB)
│       │   │
│       │   └── InstagramEmbed.tsx         # Instagram feed embed component
│       │
│       ├── data/                          # Static/fixture data
│       │   ├── home.ts                    # Home page static data (7KB)
│       │   └── results.ts                # Results page static data (17.3KB)
│       │
│       ├── lib/                           # ── Utilities & API Layer ──
│       │   ├── api.ts                     # Core API client with fetch wrapper (2.6KB)
│       │   ├── admin-api.ts               # Admin API client functions (3.5KB)
│       │   ├── site-settings.ts           # Site settings fetcher/cache (2.2KB)
│       │   ├── roles.ts                   # Role type definitions (1.3KB)
│       │   ├── utils.ts                   # General utility functions
│       │   └── video-utils.ts             # Video embed URL processing (2.2KB)
│       │
│       └── styles/
│           └── tokens.css                 # ── Design Token System (6.5KB) ──
│                                          # Brand colors, typography scale, spacing,
│                                          # radii, shadows, motion, breakpoints
│
├── server/                                # ──── BACKEND (Node.js + Express 5) ────
│   ├── .env                               # Local environment (git-ignored)
│   ├── .env.example                       # Environment variable template (63 lines)
│   ├── .sequelizerc                       # Sequelize CLI path config
│   ├── sequelize.config.js                # Sequelize CLI database credentials
│   ├── tsconfig.json                      # TypeScript config (ES2022 target)
│   ├── package.json                       # Dependencies & scripts
│   ├── backend_layout_files_info.md       # Detailed backend file documentation (521 lines)
│   ├── check.js                           # Quick DB connection check script
│   ├── test-db.js                         # Database test script
│   ├── test-render.js                     # Render deployment test
│   │
│   └── src/
│       ├── index.ts                       # Server entry point (startup, graceful shutdown)
│       ├── app.ts                         # Express app assembly (middleware stack)
│       ├── seedDatabase.ts                # Database seeder (15.3KB)
│       │
│       ├── config/
│       │   ├── environment.ts             # Zod-validated env config (3.4KB)
│       │   ├── database.ts                # Sequelize connection settings (SSL, pool)
│       │   ├── cors.ts                    # CORS configuration
│       │   └── roles.ts                   # Admin role definitions (super-admin, admin)
│       │
│       ├── controllers/
│       │   ├── admin.controller.ts        # Admin CMS operations (45.2KB — largest)
│       │   ├── auth.controller.ts         # Auth: register, OTP, login, session (12KB)
│       │   ├── form.controller.ts         # Public form submissions
│       │   ├── health.controller.ts       # Health check endpoint
│       │   └── scholarship.controller.ts  # Scholarship registration
│       │
│       ├── middlewares/
│       │   ├── authenticate.ts            # JWT verification (Bearer token)
│       │   ├── authorize.ts               # RBAC role checker
│       │   ├── errorHandler.ts            # Global error handler (AppError + Zod)
│       │   ├── notFound.ts                # 404 catch-all middleware
│       │   ├── rateLimiter.ts             # Rate limiting (default + submission presets)
│       │   ├── requestLogger.ts           # HTTP request logging (Winston)
│       │   └── validate.ts                # Zod schema validation factory
│       │
│       ├── models/                        # ── 17 Sequelize Models ──
│       │   ├── index.ts                   # Model registry & DB connection test
│       │   ├── Admin.ts                   # Admin user accounts
│       │   ├── AdminPasswordReset.ts      # Admin password reset tokens
│       │   ├── User.ts                    # Student/public user accounts
│       │   ├── OtpVerification.ts         # OTP verification records
│       │   ├── Course.ts                  # Course listings
│       │   ├── CourseRegistration.ts       # Course enrollment records
│       │   ├── ScholarshipRegistration.ts  # Scholarship exam registrations
│       │   ├── Banner.ts                  # Hero banners (home + results)
│       │   ├── StarStudent.ts             # Student achievement profiles
│       │   ├── TopperResult.ts            # NEET topper result records
│       │   ├── Notification.ts            # Announcement ticker messages
│       │   ├── NewsArticle.ts             # Blog/news posts
│       │   ├── AcademyVideo.ts            # Academy video embeds
│       │   ├── ContentBlock.ts            # CMS text overrides (visual editor)
│       │   ├── MediaRevision.ts           # Image/media revision history
│       │   ├── ContactMessage.ts          # Contact form submissions
│       │   └── SiteSetting.ts             # Global site settings (key-value)
│       │
│       ├── routes/
│       │   ├── index.ts                   # Top-level router (/health + /api/v1)
│       │   └── v1/
│       │       ├── index.ts               # V1 route aggregator
│       │       ├── health.routes.ts       # GET /api/v1/health
│       │       ├── auth.routes.ts         # Authentication routes (3.8KB)
│       │       ├── admin.routes.ts        # Admin CMS routes (11.1KB)
│       │       ├── content.routes.ts      # Content block routes (4KB)
│       │       ├── form.routes.ts         # Public form submission routes
│       │       └── scholarship.routes.ts  # Scholarship registration routes
│       │
│       ├── validation/
│       │   └── admin.schemas.ts           # Admin request Zod schemas (9.6KB)
│       │
│       ├── utils/
│       │   ├── AppError.ts               # Custom HTTP error class
│       │   ├── asyncHandler.ts            # Async route handler wrapper
│       │   ├── logger.ts                  # Winston logger setup
│       │   ├── mailer.ts                  # Email delivery (SMTP)
│       │   ├── databaseRead.ts            # Database read utilities
│       │   ├── adminPasswordReset.ts      # Password reset token generation
│       │   ├── mediaRevision.ts           # Media revision tracking
│       │   └── mediaRevision.test.ts      # Media revision tests
│       │
│       ├── scripts/
│       │   └── createAdmin.ts             # CLI admin provisioning script
│       │
│       ├── database/
│       │   ├── migrations/                # 14 migration files (Jul–Aug 2026)
│       │   └── seeders/                   # Database seeders
│       │
│       └── types/
│           ├── express.d.ts               # Express Request augmentation (req.user)
│           └── environment.d.ts           # ProcessEnv type augmentation
│
└── graphify-out/                          # Knowledge graph output (AI tooling)
```

---

## 5. Frontend — `client/`

### Framework & Configuration

- **Next.js 16.2.9** with App Router (React 19.2.4)
- **Vanilla CSS** with CSS Modules for component-scoped styles
- **Design token system** in `src/styles/tokens.css` — all colors, fonts, spacing, shadows, and motion values flow from CSS custom properties
- **Inter** typeface loaded via `next/font/google` for zero layout shift
- **Framer Motion** for scroll-triggered animations, carousels, and micro-interactions

### Route Map

| Route | Page | Component Size |
|-------|------|---------------|
| `/` | Home (redirects to `/home`) | — |
| `/home` | Landing page with hero, toppers, courses, trust bar | `HomeClient.tsx` (17.6KB) |
| `/courses` | Course listing with filters and comparison | `CoursesClient.tsx` (34.7KB) |
| `/courses/[id]` | Course detail (slug-based routing) | Dynamic route |
| `/courses/neet-fresher` | NEET Fresher course (redirected from `/courses/1`) | — |
| `/courses/neet-repeaters` | NEET Repeaters course (redirected from `/courses/3`) | — |
| `/courses/online-test-series` | Online test series (redirected from `/courses/4`) | — |
| `/courses/offline-test-series` | Offline test series (redirected from `/courses/5`) | — |
| `/admissions` | Admissions & scholarship information | `AdmissionsClient.tsx` (40.4KB) |
| `/results` | NEET toppers & results showcase | `ResultsClient.tsx` (18.4KB) |
| `/about` | Institute history, mission, faculty, infrastructure | `page.tsx` (16.8KB) |
| `/contact` | Contact form, map, callback request | `ContactClient.tsx` (39.6KB) |
| `/gallery` | Photo & video gallery with lightbox | `page.tsx` (60.8KB) |
| `/faq` | Categorized FAQ accordion | `FaqClient.tsx` + `faq-data.ts` |
| `/privacy-policy` | Privacy policy | Static page |
| `/terms` | Terms & conditions | Static page |
| `/maintenance` | Maintenance mode page | Guarded by middleware |
| `/admin` | Admin dashboard (auth-protected) | See §10 below |
| `/admin/login` | Admin sign-in | JWT + HttpOnly cookie |

### Middleware

The Next.js middleware (`src/middleware.ts`) handles:
- **Maintenance mode** — when `MAINTENANCE_MODE=true`, all public traffic is rewritten to `/maintenance`
- **Maintenance guard** — prevents manual access to `/maintenance` when the site is live (redirects to `/`)

### API Proxy Routes

The frontend includes Next.js API routes that proxy requests to the Express backend:

| Frontend API Route | Backend Target |
|-------------------|----------------|
| `/api/admin/[...path]` | `/api/v1/admin/*` |
| `/api/admin/session` | Admin session management |
| `/api/content/[pageKey]` | `/api/v1/content/*` |
| `/api/public/[...path]` | `/api/v1/*` (public endpoints) |

### Key Frontend Components

#### Layout Components
| Component | Purpose |
|-----------|---------|
| `Header.tsx` (32.5KB) | Responsive navigation bar with mobile hamburger menu, sign-in modal, and admin "Edit Site" toggle |
| `Footer.tsx` (23KB) | Site footer with quick links, contact info, social media, newsletter |
| `WhatsAppWidget.tsx` | Floating WhatsApp chat button (always visible) |
| `CookieConsent.tsx` | GDPR-style cookie consent banner |
| `AnimatedBackground.tsx` | Decorative animated background patterns |

#### UI Primitives
| Component | Purpose |
|-----------|---------|
| `Button.tsx` | Primary/secondary button variants |
| `Card.tsx` | Content card container |
| `IconButton.tsx` | Icon-only button |
| `PageHeader.tsx` | Consistent page title headers |
| `SectionHeading.tsx` | Section-level headings |
| `SignInModal.tsx` (18.4KB) | Student authentication modal (OTP-based) |
| `ProfileModal.tsx` (14.8KB) | User profile view/edit modal |

---

## 6. Backend — `server/`

### Entry Point & Startup

1. **`src/index.ts`** — Server entry point:
   - Loads and validates all environment variables via Zod
   - Creates the Express app with full middleware stack
   - Tests database connection (non-blocking — server starts even if DB is down)
   - Listens on configured port (default: 5000)
   - Registers graceful shutdown handlers (SIGTERM/SIGINT with 10s timeout)

2. **`src/app.ts`** — Express middleware stack (order matters):

| # | Middleware | Purpose |
|---|-----------|---------|
| 1 | `helmet()` | Security HTTP headers (HSTS, X-Content-Type, etc.) |
| 2 | `cors(corsOptions)` | Cross-origin access for the Next.js frontend |
| 3 | `express.json()` | JSON body parser |
| 4 | `express.urlencoded()` | URL-encoded form parser |
| 5 | `requestLogger` | Logs every request (method, URL, status, duration, IP) |
| 6 | `defaultLimiter` | Rate limit: 100 requests/15min per IP |
| 7 | Routes | All defined API routes |
| 8 | `notFound` | Catches unmatched requests → 404 |
| 9 | `errorHandler` | Global error handler → consistent JSON response |

### Error Handling Architecture

| Component | Purpose |
|-----------|---------|
| `AppError` | Custom error class with HTTP status code, status ("fail"/"error"), and operational flag |
| `asyncHandler` | Wraps async route handlers to catch rejected promises |
| `errorHandler` | Global middleware: handles AppError, ZodError (422), and unknown errors (500). Stack trace included only in development. |
| `notFound` | Returns `404` for unmatched routes |

### Utility Services

| Utility | Purpose |
|---------|---------|
| `logger.ts` | Winston logger — human-readable in dev, JSON in prod, file rotation (5MB error, 10MB combined) |
| `mailer.ts` | SMTP email sender (for admin password resets and notifications) |
| `adminPasswordReset.ts` | Generates and validates time-limited password reset tokens |
| `mediaRevision.ts` | Tracks image/media upload revisions for audit trail |
| `databaseRead.ts` | Database read utility functions |

---

## 7. Database — Models & Migrations

### Sequelize Models (17 total)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Admin** | Admin user accounts | email, password (bcrypt), role, firstName, lastName |
| **AdminPasswordReset** | Password reset token tracking | adminId, token, expiresAt |
| **User** | Student/public user accounts | name, email, phone, city |
| **OtpVerification** | OTP verification records | phone, otp, expiresAt, verified |
| **Course** | Course listings | title, slug, description, mode, fee, duration, batchDate |
| **CourseRegistration** | Course enrollment records | userId, courseId, status, paymentId |
| **ScholarshipRegistration** | Scholarship exam registrations | name, phone, email, class, city, school |
| **Banner** | Hero banners (home + results) | title, imageUrl, targetUrl, altText, position, isActive |
| **StarStudent** | Student achievement profiles | name, photo, rank, score, quote, courseAttended |
| **TopperResult** | NEET topper result records | name, rank, score, year, exam, photo, courseAttended |
| **Notification** | Announcement ticker messages | title, message, icon, type, isActive, expiresAt |
| **NewsArticle** | Blog/news content | title, slug, content, category, author, tags, publishedAt |
| **AcademyVideo** | Academy video embeds | title, videoUrl, thumbnail, category, isActive |
| **ContentBlock** | CMS text overrides (visual editor) | pageKey, fieldKey, content, originalContent |
| **MediaRevision** | Image/media revision history | entityType, entityId, fieldName, oldUrl, newUrl |
| **ContactMessage** | Contact form submissions | name, email, phone, city, courseInterest, message |
| **SiteSetting** | Global site settings (key-value) | key, value |

### Model Registration

All models are imported and initialized in `src/models/index.ts`. In development, `sequelize.sync({ alter: true })` keeps tables in sync with model definitions. In production, schema changes go through reviewed migrations.

### Database Migrations (14 files)

| Migration | Description |
|-----------|-------------|
| `20260708000000` | Create scholarship_registrations table |
| `20260708000001` | Create users table |
| `20260708000002` | Create otp_verifications table |
| `20260725000000` | Secure admin authentication |
| `20260725000001` | Create CMS and lead tables (banners, notifications, star_students, toppers, contact_messages, site_settings) |
| `20260725000002` | Create content_blocks table |
| `20260725000003` | Add banner target URL column |
| `20260726000000` | Create media_revisions table |
| `20260729081403` | Create admins table |
| `20260730000001` | Add banner alt_text column |
| `20260801000000` | Fix missing banner columns |
| `20260806000000` | Add notification icon column |
| `20260811000000` | Create admin_password_resets table |
| `20260812000000` | Add admin role column (ENUM: super-admin, admin) |

### Database Seeding

`src/seedDatabase.ts` (15.3KB) handles initial data population including the super-admin account and sample content.

---

## 8. API Routes & Endpoints

All API routes are prefixed with `/api/v1`.

### Health Check

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/health` | Public | Unversioned health check for Render load balancer |
| GET | `/api/v1/health` | Public | Versioned health check (server status, uptime, DB connection) |

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | Public | Student registration |
| POST | `/auth/otp/request` | Public | Request OTP for phone verification |
| POST | `/auth/otp/verify` | Public | Verify OTP and get JWT |
| POST | `/auth/admin/login` | Public | Admin login (email + password) → JWT + HttpOnly cookie |
| POST | `/auth/admin/logout` | Admin | Admin logout (clear session) |
| GET | `/auth/admin/session` | Admin | Validate current admin session |

### Public Forms (`/api/v1/forms`)

| Method | Endpoint | Auth | Rate Limit | Purpose |
|--------|----------|------|-----------|---------|
| POST | `/forms/contact` | Public | 10/15min | Contact form submission |
| POST | `/forms/callback` | Public | 10/15min | Callback request |
| POST | `/forms/enquiry` | Public | 10/15min | Course enquiry |

### Scholarships (`/api/v1/scholarships`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/scholarships/register` | Public | Scholarship exam registration |
| GET | `/scholarships/registrations` | Admin | List all registrations |

### Content (`/api/v1/content`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/content/:pageKey` | Public | Fetch content blocks for a page |
| PUT | `/content/:pageKey/:fieldKey` | Admin | Update a content block (visual editor) |
| DELETE | `/content/:pageKey/:fieldKey` | Admin | Restore original content |

### Admin CMS (`/api/v1/admin`) — All require Admin auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Banners** | | |
| GET | `/admin/banners` | List all banners |
| POST | `/admin/banners` | Create banner (with image upload) |
| PUT | `/admin/banners/:id` | Update banner |
| PATCH | `/admin/banners/:id/visibility` | Toggle banner visibility |
| PATCH | `/admin/banners/:id/position` | Reorder banner position |
| DELETE | `/admin/banners/:id` | Delete banner |
| **Notifications** | | |
| GET | `/admin/notifications` | List all announcements |
| POST | `/admin/notifications` | Create announcement |
| PUT | `/admin/notifications/:id` | Update announcement |
| PATCH | `/admin/notifications/:id/visibility` | Toggle visibility |
| DELETE | `/admin/notifications/:id` | Delete announcement |
| **Star Students** | | |
| GET | `/admin/star-students` | List all star students |
| POST | `/admin/star-students` | Create star student (with photo upload) |
| PUT | `/admin/star-students/:id` | Update star student |
| DELETE | `/admin/star-students/:id` | Delete star student |
| **Topper Results** | | |
| GET | `/admin/results` | List all topper results |
| POST | `/admin/results` | Create topper result |
| PUT | `/admin/results/:id` | Update topper result |
| DELETE | `/admin/results/:id` | Delete topper result |
| **Site Settings** | | |
| GET | `/admin/settings` | Get all site settings |
| PUT | `/admin/settings` | Update site settings (batch) |
| **Leads & Records** | | |
| GET | `/admin/leads/contact` | List contact form submissions |
| GET | `/admin/leads/scholarship` | List scholarship registrations |
| GET | `/admin/leads/course` | List course enquiries |
| GET | `/admin/leads/export/:type` | Export leads to CSV |
| **Admin Users** | | |
| GET | `/admin/admins` | List admin accounts |
| POST | `/admin/admins` | Create new admin |
| PUT | `/admin/admins/:id` | Update admin |
| DELETE | `/admin/admins/:id` | Delete admin |
| POST | `/admin/admins/:id/reset-password` | Initiate password reset |
| **Courses** | | |
| GET | `/admin/courses` | List all courses |
| POST | `/admin/courses` | Create course |
| PUT | `/admin/courses/:id` | Update course |
| DELETE | `/admin/courses/:id` | Delete course |

---

## 9. Authentication & Authorization

### Authentication Flow

```
Student Auth:  Phone → Request OTP → Verify OTP → JWT Token
Admin Auth:    Email + Password → JWT Token + HttpOnly Cookie
```

### JWT Configuration

| Setting | Value |
|---------|-------|
| Secret | `JWT_SECRET` (min 32 random characters) |
| Student Token TTL | `7d` (7 days) |
| Admin Token TTL | `8h` (8 hours) |
| Token Location | `Authorization: Bearer <token>` header + HttpOnly cookie (admin) |

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **super-admin** | Full access: all CMS modules, admin user management, site settings, all data |
| **admin** | CMS operations: banners, announcements, results, star students, leads, settings |

The `authorize()` middleware is a factory function that accepts allowed roles:
```typescript
router.put('/admin/banners/:id',
  authenticate,                      // Step 1: Who is this?
  authorize('super-admin', 'admin'), // Step 2: Are they allowed?
  adminController.updateBanner,      // Step 3: Do the work
);
```

### Admin Password Reset Flow

1. Super-admin initiates reset for another admin
2. Time-limited reset token generated (configurable TTL, default 60 minutes)
3. Reset link emailed (if SMTP configured) or displayed in dashboard
4. Admin uses link to set new password
5. Token is single-use and automatically expires

---

## 10. Admin Panel & Visual Website Editor

The admin panel has **two complementary workflows** for managing content:

### 1. Admin Dashboard (`/admin`)

A centralized control panel for structured content management:

| Module | Path | Features |
|--------|------|----------|
| **Dashboard Home** | `/admin` | Overview of all manageable sections |
| **Banners** | `/admin/banners` | CRUD for hero banners, image upload, position ordering, visibility toggle |
| **Notifications** | `/admin/notifications` | Manage announcement ticker messages with icons and types |
| **Results** | `/admin/results` | Topper result records with photos, ranks, and scores |
| **Settings** | `/admin/settings` | Phone, email, address, WhatsApp number, social links, callback timing |
| **Content** | `/admin/content` | CMS text block management |
| **Database** | `/admin/database` | Data management and export tools |
| **Login** | `/admin/login` | Admin authentication |
| **Reset Password** | `/admin/reset-password` | Password reset flow |

### 2. Visual Website Editor (Live Edit Mode)

An inline WYSIWYG editing experience layered on top of the live website:

- **Activation:** Admin signs in → clicks "Edit Site" in the header
- **Editable text:** Receives a subtle underline, click to edit inline
- **Content overrides:** Changes stored separately — original text is never overwritten
- **Restore:** Red bin icon = restore to original text (not delete)
- **Collection sections:** Banners, announcements, star students, and results show a "Manage" button with full CRUD dialogs
- **Preview mode:** Bottom toolbar lets admin toggle between edit and preview states

### Key Admin Components

| Component | Lines/KB | Responsibility |
|-----------|----------|---------------|
| `AdminContentManager.tsx` | 22.6KB | Central content management UI |
| `BannerEditor.tsx` | 10.9KB | Banner CRUD with image upload via Supabase |
| `StarStudentEditor.tsx` | 11KB | Star student profile management |
| `NotificationEditor.tsx` | 14.8KB | Announcement ticker editor with icons |
| `ResultEditor.tsx` | 9.9KB | Topper result editor |
| `SettingsEditor.tsx` | 7KB | Global site settings form |
| `AdminLeadTable.tsx` | 9.6KB | Lead table with search, filter, and export |
| `LeadsDrawer.tsx` | 8.9KB | Side drawer for leads detail view |
| `CourseEditor.tsx` | 7.9KB | Course CRUD editor |
| `RevisionHistoryButton.tsx` | 5.9KB | Content revision audit trail viewer |

### Admin Theming

The admin dashboard supports **dark/light mode** with theme preference persisted in `localStorage`. A synchronous inline script in the root layout prevents flash-of-wrong-theme on load. The theme is scoped to `/admin` routes only — the public website always renders in light mode.

---

## 11. Website Pages & Features

### Home Page (`/home`)

The primary landing page designed for maximum conversion:

| Section | Description |
|---------|-------------|
| **Hero Banner** | Full-width animated banner with auto-rotation, CTAs ("Explore Courses", "Request Callback", "Register for Scholarship"), countdown timer |
| **Toppers Carousel** | Student photo, name, rank, score — filterable by year. Link to full Results page |
| **Announcement Ticker** | Horizontal scrolling notifications (scholarship dates, registrations, results). Admin-manageable |
| **Academy Insights** | Key statistics and information about the institute |
| **Explore Courses** | Course category chips (NEET 11th, 12th, Repeater, Foundation) with enrollment counts and CTAs |
| **Why SCA** | Value propositions — why choose Success Code Academy |
| **Parents Trust Us** | Social proof section with testimonials and trust indicators |
| **Trust Bar** | Animated counters: Students Enrolled, Years of Experience, Success Rate, Toppers Produced |

### Courses Page (`/courses`)

| Feature | Description |
|---------|-------------|
| Course Cards | Title, class level, duration, mode, fee teaser, next batch date, CTA |
| Filters | Batch type, fee range, duration, mode |
| Course Comparison | Select 2-3 courses for side-by-side comparison |
| Course Detail Pages | Overview, batch schedule, faculty, demo video, syllabus, fee structure, brochure download, FAQ, reviews |
| URL Redirects | Legacy numeric IDs → SEO-friendly slugs (e.g., `/courses/1` → `/courses/neet-fresher`) |

### Admissions Page (`/admissions`)

Scholarship and admissions information with:
- Scholarship exam details (venue, date, mode, eligibility, rewards)
- Registration flow
- Seats remaining with urgency indicators
- Preparation resources (syllabus, sample papers)
- Past scholarship winners

### Results Page (`/results`)

| Feature | Description |
|---------|-------------|
| Toppers Gallery | Year-wise with photo, name, rank, score, course attended |
| Filters | Year, exam type, rank range |
| Aggregate Stats | Total selections, AIR under 100, AIR under 1000 |
| Social Sharing | Share button on each topper card |

### About Page (`/about`)

- Institute history and mission/vision
- Faculty profiles with photos, qualifications, and experience
- Infrastructure photos (labs, library, classrooms, campus)
- Awards, recognitions, and media mentions

### Contact Page (`/contact`)

| Feature | Description |
|---------|-------------|
| Contact Form | Name, phone, email, city, course interest, message, preferred callback time |
| Google Maps Embed | Interactive map with custom pin and entrance animation |
| Side Panel | Campus/classroom imagery for trust reinforcement |
| WhatsApp Chat | Direct WhatsApp Business integration |
| Callback Promise | "We call back within 2 hours" messaging |
| Lead Storage | All submissions stored in database + notification to admissions team |

### Gallery Page (`/gallery`)

- Photo and video gallery organized by categories (Classroom Sessions, Events, Result Celebrations, Seminars)
- Lightbox viewer with navigation
- Video thumbnails with YouTube/Vimeo embeds
- CMS-managed uploads

### FAQ Page (`/faq`)

- Categorized accordion-style FAQ (15.5KB of structured Q&A data)
- Categories: General, Courses, Scholarships, Payments, Student Portal, Test Series
- FAQ schema markup for SEO (FAQPage structured data)

### Additional Pages

| Page | Purpose |
|------|---------|
| Privacy Policy | Legal privacy policy |
| Terms & Conditions | Legal terms of service |
| Maintenance | Shown when `MAINTENANCE_MODE=true` — all traffic is rewritten here |
| 404 Page | Custom branded not-found page |

### Cross-Cutting Features

| Feature | Implementation |
|---------|---------------|
| **Floating WhatsApp Button** | `WhatsAppWidget.tsx` — persistent on all public pages |
| **Cookie Consent** | `CookieConsent.tsx` — GDPR-style consent banner |
| **Sign-In Modal** | `SignInModal.tsx` — OTP-based student authentication |
| **User Profile** | `ProfileModal.tsx` — user profile management |
| **Instagram Feed** | `InstagramEmbed.tsx` — embedded Instagram content |
| **Animated Background** | `AnimatedBackground.tsx` — decorative visual effects |
| **Responsive Design** | All pages responsive from 320px (iPhone SE) to desktop |
| **Loading States** | Global loading skeleton (`loading.tsx`) |

---

## 12. Design System & Branding

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand-primary` | `#102F5E` | Deep navy — headers, navigation, primary CTAs |
| `--color-brand-primary-hover` | `#0A2348` | Darker navy — hover states |
| `--color-brand-accent` | `#078D92` | Teal — secondary CTAs, highlights, links |
| `--color-brand-accent-hover` | `#056F73` | Darker teal — hover states |
| `--color-brand-gold` | `#D99B2B` | Gold — premium accents, achievements |
| `--color-brand-primary-soft` | `#EDF3FB` | Light blue — soft backgrounds |
| `--color-brand-accent-soft` | `#EAF8F7` | Light teal — soft accent backgrounds |
| `--color-brand-gold-soft` | `#FFF7E6` | Light gold — soft gold backgrounds |

### Typography

| Element | Font | Weight |
|---------|------|--------|
| Headings | Inter (via `next/font/google`) | 600–700 (Semibold/Bold) |
| Body Text | Inter | 400 (Regular) |
| Fallback | Segoe UI → system-ui → sans-serif | — |

### Fluid Type Scale

The design system uses `clamp()` for responsive typography that interpolates between 320px and 1280px viewports:

| Token | Range | Purpose |
|-------|-------|---------|
| `--font-size-micro` | 11px → 12.8px | Very small labels |
| `--font-size-caption` | 12px → 14px | Captions, footnotes |
| `--font-size-small` | 13px → 15px | Small text |
| `--font-size-body` | 16px | Body text |
| `--font-size-lead` | 16px → 18px | Lead paragraphs |
| `--font-size-heading-4` | 16px → 20px | H4 headings |
| `--font-size-heading-3` | 18px → 28px | H3 headings |
| `--font-size-heading-2` | 22px → 44px | H2 headings |
| `--font-size-heading-1` | 28px → 60px | H1 headings |

### Spacing & Layout

| Token | Value | Purpose |
|-------|-------|---------|
| `--page-gutter` | 16px → 32px (fluid) | Page horizontal padding |
| `--section-space` | 40px → 112px (fluid) | Vertical section spacing |
| `--container-content` | 80rem (1280px) | Content max-width |
| `--container-reading` | 48rem (768px) | Reading column max-width |
| `--container-admin` | 90rem (1440px) | Admin panel max-width |
| `--header-h` | 76px (desktop) / 68px (mobile) | Fixed header height |

### Shape, Shadows & Motion

| Category | Tokens |
|----------|--------|
| **Border Radius** | `--radius-control: 0.75rem`, `--radius-card: 1.125rem`, `--radius-dialog: 1.375rem`, `--radius-pill: 999px` |
| **Shadows** | `--shadow-xs` (subtle), `--shadow-sm` (card), `--shadow-md` (hover) |
| **Motion** | `--duration-fast: 120ms`, `--duration-normal: 220ms`, `--duration-overlay: 280ms` |
| **Easing** | `--ease-standard: cubic-bezier(0.2, 0, 0, 1)` |

### Responsive Breakpoints

| Tier | Query | Target Devices |
|------|-------|---------------|
| Small phone | `max-width: 380px` | iPhone SE, older Android |
| Phone | `max-width: 767px` | All phones |
| Tablet | `768px – 1023px` | iPad portrait, Android tablets |
| Desktop | `min-width: 1024px` | Laptops and up |

---

## 13. SEO & Performance

### SEO Implementation

| Feature | Implementation |
|---------|---------------|
| **Meta Tags** | Dynamic `title` and `description` per page via Next.js `metadata` API |
| **Open Graph** | OG title, description, and image for social sharing |
| **Sitemap** | Auto-generated XML sitemap via `next-sitemap` (site URL: `successcodeacademy.in`) |
| **Robots.txt** | Auto-generated with proper crawl directives |
| **Canonical URLs** | Proper canonical tags to prevent duplicate content |
| **Schema Markup** | FAQPage, LocalBusiness structured data |
| **Semantic HTML** | Proper heading hierarchy (single H1 per page), semantic elements |
| **Alt Text** | All images include descriptive alt text |
| **Font Loading** | `next/font` with `display: swap` — zero layout shift |

### Performance Targets

| Metric | Target |
|--------|--------|
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| First Input Delay (FID) | < 100ms |

### Image Optimization

- Next.js Image component with automatic format optimization
- Supabase remote images whitelisted via `next.config.ts`
- Unoptimized in development for faster iteration
- WebP format support where possible
- Lazy loading for below-the-fold images

---

## 14. Deployment & Infrastructure

### Production Architecture

| Layer | Platform | URL |
|-------|----------|-----|
| **Frontend** | Vercel | [successcodeacademy.in](https://www.successcodeacademy.in) |
| **Backend** | Render | Backend API URL (always-on Starter instance) |
| **Database** | Supabase | PostgreSQL (Pro Plan — no auto-pause, daily backups) |
| **Object Storage** | Supabase Storage | Images, PDFs, brochures, gallery media |
| **CDN** | Cloudflare | Recommended for fast media delivery across India |
| **Domain** | successcodeacademy.in | Annual renewal separate from hosting |

### Deployment Flow

**Frontend (Vercel):**
- Git push to main branch triggers automatic deployment
- Build command: `npm run build` → `next build` + `next-sitemap` (postbuild)
- Uses `.vercelignore` for deployment optimization

**Backend (Render):**
- Git push triggers build
- Build: `npm install` → `npm run build` (TypeScript compilation)
- Pre-start: `npx sequelize-cli db:migrate` (auto-run pending migrations)
- Start: `node dist/index.js`

### Supabase Image Hosting

Remote images from Supabase are served through the Next.js image optimization pipeline:

```typescript
// next.config.ts
images: {
  remotePatterns: [{
    protocol: "https",
    hostname: "your-project-id.supabase.co",
    pathname: "**",
  }],
}
```

---

## 15. Hosting & Infrastructure Services

The website runs on three cloud services to stay online, fast, and secure:

| Service | Role | What It Does |
|---------|------|-------------|
| **Vercel** | Frontend Hosting | Hosts the Next.js website with SSR, edge caching, and automatic deployments on git push |
| **Render** | Backend Hosting | Hosts the Express API server as an always-on instance (no cold starts or spin-downs) |
| **Supabase** | Database & Storage | PostgreSQL database for all structured data + object storage for images, PDFs, brochures, and gallery media. Includes daily automated backups |
| **Cloudflare** | CDN (Recommended) | Content delivery network for fast media loading across India |

All three services are industry-standard, pay-monthly cloud providers. The codebase is platform-agnostic — future migration to AWS (S3, EC2, RDS, CloudFront) or other providers is possible without large rewrites.

---

## 16. Messaging & Notification Services

The platform uses external messaging services for OTP authentication and lead follow-up notifications:

| Channel | Service | Purpose |
|---------|---------|---------|
| **SMS OTP** | MSG91 (or similar aggregator) | Phone-based student login via one-time password. Requires DLT registration with a telecom operator (sender ID, approved message templates) |
| **WhatsApp** | WhatsApp Business API via MSG91 | Automated lead follow-up notifications and OTP delivery. Requires Meta Business verification |
| **Email** | SMTP (configurable) | Admin password reset emails, lead notifications, and optional student communications |

### Setup Requirements

- **SMS:** DLT registration with a telecom operator is mandatory before sending any SMS in India (sender ID/PEID, approved sender header, approved message templates)
- **WhatsApp:** Meta Business verification followed by an approximately 30-day "campaign activity" period before authentication/utility messages are enabled
- **Email:** SMTP credentials configured via environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`). Until configured, admin password reset links are shown directly in the dashboard instead of being emailed

---

## 17. Environment Variables Reference

### Client (`client/.env.local`)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API base URL |
| `MAINTENANCE_MODE` | `true` / `false` | Enable/disable maintenance mode |

### Server (`server/.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| **Server** | | |
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | HTTP listen port |
| **Database** | | |
| `DB_HOST` | — | Supabase PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `postgres` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | — | Database password |
| **Authentication** | | |
| `JWT_SECRET` | — | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` | Student token TTL |
| `ADMIN_JWT_EXPIRES_IN` | `8h` | Admin token TTL |
| **Admin Provisioning** | | |
| `ADMIN_EMAIL` | — | Initial admin email |
| `ADMIN_MOBILE_NUMBER` | — | Initial admin phone |
| `ADMIN_PASSWORD` | — | Initial admin password |
| `ADMIN_FIRST_NAME` | `Site` | Initial admin first name |
| `ADMIN_LAST_NAME` | `Administrator` | Initial admin last name |
| `ADMIN_ROLE` | `admin` | Initial admin role |
| **Super Admin** | | |
| `SUPER_ADMIN_EMAIL` | — | Super admin email |
| `SUPER_ADMIN_PASSWORD` | — | Super admin password (change after first login!) |
| `SUPER_ADMIN_MOBILE_NUMBER` | — | Super admin phone |
| `SUPER_ADMIN_NAME` | `Super Administrator` | Super admin display name |
| **CORS** | | |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| **Password Reset** | | |
| `APP_BASE_URL` | — | Public website URL for reset links |
| `ADMIN_RESET_TTL_MINUTES` | `60` | Password reset link validity (minutes) |
| **Email (Optional)** | | |
| `SMTP_HOST` | — | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASSWORD` | — | SMTP password |
| `MAIL_FROM` | — | Sender email address |
| **Logging** | | |
| `LOG_LEVEL` | `debug` | Winston log level |

> ⚠️ **Never commit `.env` files. Never expose keys in frontend code.**

---

## 18. Getting Started — Local Development

### Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)
- **PostgreSQL** (via Supabase or local instance)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd success-code-academy
```

### 2. Set Up the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your database credentials and secrets
npm install
npm run dev        # Starts Express on port 5000 (with nodemon)
```

### 3. Set Up the Frontend

```bash
cd client
# Ensure .env.local has NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev        # Starts Next.js on port 3000
```

### 4. Access the Application

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:5000/health` | Backend health check |
| `http://localhost:5000/api/v1/health` | API health check (with DB status) |

### Available Scripts

**Client:**

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `postbuild` | `next-sitemap` | Generate sitemap after build |
| `lint` | `eslint` | Run linter |

**Server:**

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nodemon src/index.ts` | Start development server (auto-reload) |
| `build` | `tsc` | Compile TypeScript to JavaScript |
| `start` | `node dist/index.js` | Start production server |
| `prestart` | `npx sequelize-cli db:migrate` | Run pending migrations before start |
| `admin:create` | `ts-node src/scripts/createAdmin.ts` | Create admin account via CLI |
| `db:migrate` | `sequelize-cli db:migrate` | Run database migrations |
| `postinstall` | `npm run build` | Auto-build after install (for Render) |

---

## 19. Development Standards & Security

### Frontend Standards

- Reusable components — no UI duplication
- Modular page sections
- Typed props for every component
- Static/mock data in typed data files until APIs are ready
- Semantic HTML for SEO and accessibility
- Loading, empty, and error states for all dynamic content
- Mobile-first responsive design

### Backend Standards

- Service-controller-route separation
- Business logic isolated from route files
- Migrations for all schema changes
- Environment variables for all secrets
- Centralized error handling (no try/catch in routes)
- Request validation via Zod before database operations
- Logging for admin and payment actions

### Security Standards

| Rule | Implementation |
|------|---------------|
| No `.env` in git | `.gitignore` covers `.env` files |
| No frontend secrets | Environment variables prefixed with `NEXT_PUBLIC_` only for safe values |
| Rate limiting | Global (100/15min) + submissions (10/15min) |
| Input sanitization | Zod validation + content sanitization before display |
| Password hashing | bcrypt with automatic salting |
| File upload validation | MIME type, extension, and size checks |
| RBAC enforcement | All CMS mutations require authentication + role check |
| Payment verification | Server-side webhook verification before access grant |
| CORS | Strict origin allowlist |
| Security headers | Helmet.js (HSTS, X-Content-Type, X-Frame-Options, etc.) |
| SSL | Required for all Supabase connections |

### Definition of Done

A feature is complete when:
- ✅ Matches specified requirements
- ✅ Responsive on mobile, tablet, and desktop
- ✅ Has loading, empty, and error states
- ✅ Uses validated data and typed interfaces
- ✅ SEO-friendly (if publicly visible)
- ✅ CMS-manageable (if marked as CMS content)
- ✅ Doesn't break existing routes or layout
- ✅ Follows brand guidelines
- ✅ Manually tested in browser

---

## 20. Implementation


| Feature | Status |
|---------|--------|
| Design system and layout shell | ✅ |
| Header, footer, WhatsApp widget, sticky callback | ✅ |
| Home page (all sections) | ✅ |
| Courses listing and detail pages | ✅ |
| Admissions/Scholarships with registration | ✅ |
| Results / Toppers page | ✅ |
| Contact and callback lead flow | ✅ |
| About Us page | ✅ |
| Gallery page | ✅ |
| FAQ page | ✅ |
| Admin CMS dashboard | ✅ |
| Visual website editor | ✅ |
| Admin authentication (JWT + HttpOnly cookies) | ✅ |
| RBAC (super-admin / admin) | ✅ |
| Student OTP authentication | ✅ |
| Privacy Policy & Terms pages | ✅ |
| Maintenance mode | ✅ |
| SEO (sitemap, robots.txt, meta tags, schema) | ✅ |
| Production deployment (Vercel + Render + Supabase) | ✅ |



---


<div align="center">

**Success Code Academy — Empowering NEET Aspirants**

*Built with ❤️ for students, parents, and educators*

[successcodeacademy.in](https://www.successcodeacademy.in)

</div>
