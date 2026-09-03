# Graph Report - Success-Code-Academy  (2026-09-03)

## Corpus Check
- 243 files · ~3,727,365 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1299 nodes · 2105 edges · 163 communities (114 shown, 49 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `834dc952`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin.routes.ts
- home.ts
- app.ts
- admin.controller.ts
- ResultsClient.tsx
- server/package.json
- User
- lib/roles.ts
- EditModeContext.tsx
- devDependencies
- faq-data.ts
- OtpVerification.ts
- Footer.tsx
- compilerOptions
- auth.controller.ts
- Backend Foundation — Complete File-by-File Summary
- EditableText.tsx
- AcademyInsights.tsx
- HomeClient.tsx
- compilerOptions
- adminApiFetch
- Header.tsx
- seedDatabase.ts
- dependencies
- MediaRevision.ts
- 17. Environment Variables Reference
- loadSettingsMap
- recordMediaRevision
- admin/[...path]/route.ts
- Success Code Academy NEET Coaching Website - Project Master Context
- StarStudent.ts
- assertNotLastSuperAdmin
- getListOptions
- opencode.json
- Writing Guidelines for Postgres References
- replacePaths.js
- public/[...path]/route.ts
- app/layout.tsx
- ContentBlock.ts
- [pageKey]/route.ts
- AdmissionsClient.tsx
- AcademyVideo.ts
- adminPasswordReset.ts
- Banner.ts
- content.routes.ts
- 🏆 Success Code Academy — Master Project Documentation
- NewsArticle.ts
- Notification
- 11. Website Pages & Features
- SiteSetting.ts
- TopperResult.ts
- models/index.ts
- test-render.js
- Card.tsx
- getSupabase
- IconButton.tsx
- PageHeader.tsx
- SectionHeading.tsx
- middleware.ts
- graphify.js
- publicStudent
- 5. Frontend — `client/`
- environment.d.ts
- express.d.ts
- test-db.js
- eslint.config.mjs
- next.config.ts
- Section Definitions
- Success Code Academy Admin Guide
- [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02)
- Supabase Postgres Best Practices
- 5.3 Scholarships Page
- 14. Implementation Phases
- 2.2 Core Technology Stack
- 5.5 Student Hub
- check.js
- useEditModeOptional
- client/README.md
- 12. Forms, Leads & Conversion Rules
- 13. Payment & Access Control
- 15. Development Standards
- 5.2 Courses Page
- 5.4 Test Series Page
- 9. Backend Modules & Data Models
- 17. Environment Variables
- 5.7 Blogs & Reviews
- 7. Student Login Portal
- 8. Admin / CMS Requirements
- AGENTS.md
- rules/graphify.md
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md
- workflows/graphify.md
- client/AGENTS.md
- 12. Design System & Branding
- 18. Getting Started — Local Development
- 8. API Routes & Endpoints
- 10. Admin Panel & Visual Website Editor
- 19. Development Standards & Security
- 7. Database — Models & Migrations
- 9. Authentication & Authorization
- 13. SEO & Performance
- 14. Deployment & Infrastructure
- 3. Technology Stack
- 6. Backend — `server/`

## God Nodes (most connected - your core abstractions)
1. `adminApiFetch()` - 47 edges
2. `Success Code Academy NEET Coaching Website - Project Master Context` - 32 edges
3. `🏆 Success Code Academy — Master Project Documentation` - 22 edges
4. `compilerOptions` - 20 edges
5. `useEditModeOptional()` - 19 edges
6. `EditableText()` - 16 edges
7. `compilerOptions` - 16 edges
8. `AdminModal()` - 15 edges
9. `useEditMode()` - 15 edges
10. `sendMail()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `isAdminUser()` --calls--> `isAdminRole()`  [EXTRACTED]
  client/src/lib/api.ts → client/src/lib/roles.ts
- `generateMetadata()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CourseDetailPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CoursesPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/page.tsx → client/src/lib/api.ts
- `GalleryPage()` --calls--> `parseVideoUrl()`  [EXTRACTED]
  client/src/app/(main)/gallery/page.tsx → client/src/lib/video-utils.ts

## Import Cycles
- None detected.

## Communities (163 total, 49 thin omitted)

### Community 0 - "admin.routes.ts"
Cohesion: 0.06
Nodes (56): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), SUPER_ADMIN, authenticate, ADMIN_ROLE_SET, authorize() (+48 more)

### Community 1 - "home.ts"
Cohesion: 0.18
Nodes (10): Course, courses, NavLink, NewsItem, newsItems, overviewFeatures, Statistic, statistics (+2 more)

### Community 2 - "app.ts"
Cohesion: 0.18
Nodes (9): app, corsOptions, envSchema, parsed, errorHandler(), isZodError(), notFound(), requestLogger() (+1 more)

### Community 3 - "admin.controller.ts"
Cohesion: 0.05
Nodes (39): ADMIN_PUBLIC_ATTRIBUTES, createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm, createNewsArticle, createNotification (+31 more)

### Community 4 - "ResultsClient.tsx"
Cohesion: 0.07
Nodes (25): Course, CoursesClient(), classroomFeatures, CourseDetailClient(), CourseDetailClientProps, courseVisuals, timeSlots, CourseDetailPage() (+17 more)

### Community 5 - "server/package.json"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 6 - "User"
Cohesion: 0.33
Nodes (4): initUser(), User, UserAttributes, UserCreationAttributes

### Community 7 - "lib/roles.ts"
Cohesion: 0.11
Nodes (29): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), AdminLayout(), AdminTheme, navigation, routeNames (+21 more)

### Community 8 - "EditModeContext.tsx"
Cohesion: 0.24
Nodes (7): metadata, EditModeContext, EditModeContextValue, EditModeProvider(), LeadsDrawer(), CookieConsent(), Footer()

### Community 9 - "devDependencies"
Cohesion: 0.05
Nodes (37): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, devDependencies (+29 more)

### Community 10 - "faq-data.ts"
Cohesion: 0.28
Nodes (5): FaqItem, FaqSection, faqSections, FaqClient(), metadata

### Community 11 - "OtpVerification.ts"
Cohesion: 0.50
Nodes (4): initOtpVerification(), OtpVerification, OtpVerificationAttributes, OtpVerificationCreationAttributes

### Community 12 - "Footer.tsx"
Cohesion: 0.19
Nodes (11): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata, EditableSection(), EditableSectionProps, WhatsAppWidget() (+3 more)

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (29): dist, ES2022, node, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+21 more)

### Community 14 - "auth.controller.ts"
Cohesion: 0.06
Nodes (72): sendAdminPasswordReset, AuthPurpose, changeAdminPassword, checkMobileOrLogin, createToken(), getCurrentUser, loginAdmin, publicAdmin() (+64 more)

### Community 15 - "Backend Foundation — Complete File-by-File Summary"
Cohesion: 0.06
Nodes (35): Backend Foundation — Complete File-by-File Summary, Commit 1 + 2: TypeScript Config Fix + Environment Configuration, Commit 3: Logger Setup, Commit 4: Error Handling Infrastructure, Commit 5: Database Connection, Commit 6: Core Middleware Stack, Commit 7: Authentication Middleware, Commit 8: Routes, Controllers & App Assembly (+27 more)

### Community 16 - "EditableText.tsx"
Cohesion: 0.17
Nodes (12): EditableTextProps, ContentKind, ContentMap, ContentOverride, ContentScope, fetchContentMap(), LiveContentContext, LiveContentContextValue (+4 more)

### Community 17 - "AcademyInsights.tsx"
Cohesion: 0.18
Nodes (11): categoryConfig, GalleryPage(), VideoItem, videoItems, AcademyInsights(), BlogItem, VideoItem, InstagramEmbed() (+3 more)

### Community 18 - "HomeClient.tsx"
Cohesion: 0.16
Nodes (10): Announcement, HomeBanner, HomeClient(), PublicContentResponse, renderAnnouncementIcon(), ParentsTrustUs(), learningPath, proofPoints (+2 more)

### Community 19 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 20 - "adminApiFetch"
Cohesion: 0.05
Nodes (63): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+55 more)

### Community 21 - "Header.tsx"
Cohesion: 0.17
Nodes (11): Header(), HeaderUser, mobileNavIcons, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal() (+3 more)

### Community 22 - "seedDatabase.ts"
Cohesion: 0.27
Nodes (12): main(), Env, scheduleDatabaseReconnect(), startServer(), sequelize, testConnection(), claimMobileNumber(), seedDatabase() (+4 more)

### Community 23 - "dependencies"
Cohesion: 0.05
Nodes (43): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+35 more)

### Community 24 - "MediaRevision.ts"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 25 - "17. Environment Variables Reference"
Cohesion: 0.67
Nodes (3): 17. Environment Variables Reference, Client (`client/.env.local`), Server (`server/.env`)

### Community 26 - "loadSettingsMap"
Cohesion: 0.67
Nodes (3): getSettings, loadSettingsMap(), updateSettings

### Community 27 - "recordMediaRevision"
Cohesion: 0.18
Nodes (11): deleteAcademyVideo, deleteBanner, deleteNewsArticle, deleteResult, deleteStarStudent, recordMediaRevision(), updateAcademyVideo, updateBanner (+3 more)

### Community 28 - "admin/[...path]/route.ts"
Cohesion: 0.24
Nodes (9): backendBase(), DELETE, forward(), GET, HandlerContext, isSameOrigin(), PATCH, POST (+1 more)

### Community 29 - "Success Code Academy NEET Coaching Website - Project Master Context"
Cohesion: 0.09
Nodes (22): 10. SEO, Performance & Technical Requirements, 11. Design & Branding Guidelines, 16. Testing & Quality Checklist, 18. AI Agent Implementation Instructions, 19. Definition of Done, 1. Project Overview, 20. Final Product Direction, 3. Repository Structure (+14 more)

### Community 30 - "StarStudent.ts"
Cohesion: 0.50
Nodes (4): initStarStudent(), StarStudent, StarStudentAttributes, StarStudentCreationAttributes

### Community 31 - "assertNotLastSuperAdmin"
Cohesion: 0.29
Nodes (8): assertAdminIdentityIsFree(), assertNotLastSuperAdmin(), countSuperAdmins(), createAdminAccount, deleteAdminAccount, getAdminAccounts, publicAdminAccount(), updateAdminAccount

### Community 32 - "getListOptions"
Cohesion: 0.39
Nodes (8): getContactMessages, getCourseForms, getCourses, getListOptions(), getScholarshipForms, getUsers, searchLeads, sendPaginated()

### Community 34 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 35 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 36 - "replacePaths.js"
Cohesion: 0.33
Nodes (3): directoryMap, fs, path

### Community 37 - "public/[...path]/route.ts"
Cohesion: 0.60
Nodes (5): backendBase(), GET(), POST(), proxy(), PUT()

### Community 38 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, StyledJsxRegistry()

### Community 39 - "ContentBlock.ts"
Cohesion: 0.40
Nodes (5): ContentBlock, ContentBlockAttributes, ContentBlockCreationAttributes, ContentBlockKind, initContentBlock()

### Community 40 - "[pageKey]/route.ts"
Cohesion: 0.60
Nodes (4): backendUrl(), GET(), latestContent, staleContentResponse()

### Community 42 - "AcademyVideo.ts"
Cohesion: 0.50
Nodes (4): AcademyVideo, AcademyVideoAttributes, AcademyVideoCreationAttributes, initAcademyVideo()

### Community 43 - "adminPasswordReset.ts"
Cohesion: 0.32
Nodes (6): appBaseUrl(), AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset(), buildResetUrl()

### Community 44 - "Banner.ts"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

### Community 45 - "content.routes.ts"
Cohesion: 0.29
Nodes (5): asyncHandler(), AsyncRouteHandler, isTransientDatabaseError(), readFromDatabase(), TRANSIENT_DATABASE_ERRORS

### Community 46 - "🏆 Success Code Academy — Master Project Documentation"
Cohesion: 0.17
Nodes (11): 15. Hosting & Infrastructure Services, 16. Messaging & Notification Services, 1. Project Overview, 20. Implementation, 2. High-Level Architecture, 4. Repository Structure, Key Tagline, Setup Requirements (+3 more)

### Community 47 - "NewsArticle.ts"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 48 - "Notification"
Cohesion: 0.50
Nodes (4): initNotification(), Notification, NotificationAttributes, NotificationCreationAttributes

### Community 49 - "11. Website Pages & Features"
Cohesion: 0.18
Nodes (11): 11. Website Pages & Features, About Page (`/about`), Additional Pages, Admissions Page (`/admissions`), Contact Page (`/contact`), Courses Page (`/courses`), Cross-Cutting Features, FAQ Page (`/faq`) (+3 more)

### Community 50 - "SiteSetting.ts"
Cohesion: 0.50
Nodes (4): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes

### Community 51 - "TopperResult.ts"
Cohesion: 0.50
Nodes (4): initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes

### Community 52 - "models/index.ts"
Cohesion: 0.12
Nodes (19): dbConfig, ContactMessage, ContactMessageAttributes, ContactMessageCreationAttributes, initContactMessage(), Course, initCourse(), CourseRegistration (+11 more)

### Community 53 - "test-render.js"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 56 - "getSupabase"
Cohesion: 0.50
Nodes (4): getSignedUploadUrl, getSupabase(), upload, uploadImage

### Community 63 - "publicStudent"
Cohesion: 0.67
Nodes (3): createUser, publicStudent(), updateUser

### Community 64 - "5. Frontend — `client/`"
Cohesion: 0.25
Nodes (8): 5. Frontend — `client/`, API Proxy Routes, Framework & Configuration, Key Frontend Components, Layout Components, Middleware, Route Map, UI Primitives

### Community 79 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 80 - "Success Code Academy Admin Guide"
Cohesion: 0.22
Nodes (7): Admin dashboard, Safe editing habits, Sign in, Success Code Academy Admin Guide, Troubleshooting, Two ways to update the website, Visual website editor

### Community 81 - "[1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02)"
Cohesion: 0.25
Nodes (7): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), Bug Fixes, Bug Fixes, Changelog, Features, Features

### Community 82 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 83 - "5.3 Scholarships Page"
Cohesion: 0.33
Nodes (6): 5.3 Scholarships Page, Scholarship Achievements, Scholarship Exam Detail Page, Scholarship FAQs, Scholarship Listing, Scholarship Preparation

### Community 84 - "14. Implementation Phases"
Cohesion: 0.40
Nodes (5): 14. Implementation Phases, Phase 1 Build Order, Phase 2 Build Order, Phase 3 Build Order, Phase 4 Build Order

### Community 85 - "2.2 Core Technology Stack"
Cohesion: 0.40
Nodes (5): 2.1 Deployment Environment - Current Phase, 2.2 Core Technology Stack, 2. Architecture & Technology Stack, Backend - `server/`, Frontend - `client/`

### Community 86 - "5.5 Student Hub"
Cohesion: 0.40
Nodes (5): 5.5 Student Hub, NCERT Solutions, NEET Answer Key, Study Material, Success Code Academy G-Books

### Community 88 - "useEditModeOptional"
Cohesion: 0.19
Nodes (13): Course, courseStyles, ExploreCourses(), ParsedResult, parseResult(), resolveImageSource(), StarStudent, ToppersCarousel() (+5 more)

### Community 89 - "client/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 90 - "12. Forms, Leads & Conversion Rules"
Cohesion: 0.50
Nodes (4): 12. Forms, Leads & Conversion Rules, Conversion Rules, Form Requirements, Public Forms

### Community 91 - "13. Payment & Access Control"
Cohesion: 0.50
Nodes (4): 13. Payment & Access Control, Access Control, Payment Use Cases, Required Flow

### Community 92 - "15. Development Standards"
Cohesion: 0.50
Nodes (4): 15. Development Standards, Backend Standards, Frontend Standards, Security Standards

### Community 106 - "5.2 Courses Page"
Cohesion: 0.50
Nodes (4): 5.2 Courses Page, Course Categories, Course Detail Page Requirements, Course Listing Requirements

### Community 107 - "5.4 Test Series Page"
Cohesion: 0.50
Nodes (4): 5.4 Test Series Page, Student Test Dashboard, Test Series Categories, Test Series Detail Page

### Community 108 - "9. Backend Modules & Data Models"
Cohesion: 0.50
Nodes (4): 9. Backend Modules & Data Models, API Design Rules, Core Models, Example API Routes

### Community 109 - "17. Environment Variables"
Cohesion: 0.67
Nodes (3): 17. Environment Variables, Client, Server

### Community 110 - "5.7 Blogs & Reviews"
Cohesion: 0.67
Nodes (3): 5.7 Blogs & Reviews, Blog Section, Student Reviews

### Community 111 - "7. Student Login Portal"
Cohesion: 0.67
Nodes (3): 7. Student Login Portal, Authentication, Student Dashboard Features

### Community 112 - "8. Admin / CMS Requirements"
Cohesion: 0.67
Nodes (3): 8. Admin / CMS Requirements, Admin Roles, CMS Features

### Community 152 - "12. Design System & Branding"
Cohesion: 0.29
Nodes (7): 12. Design System & Branding, Brand Colors, Fluid Type Scale, Responsive Breakpoints, Shape, Shadows & Motion, Spacing & Layout, Typography

### Community 153 - "18. Getting Started — Local Development"
Cohesion: 0.29
Nodes (7): 18. Getting Started — Local Development, 1. Clone the Repository, 2. Set Up the Backend, 3. Set Up the Frontend, 4. Access the Application, Available Scripts, Prerequisites

### Community 154 - "8. API Routes & Endpoints"
Cohesion: 0.29
Nodes (7): 8. API Routes & Endpoints, Admin CMS (`/api/v1/admin`) — All require Admin auth, Authentication (`/api/v1/auth`), Content (`/api/v1/content`), Health Check, Public Forms (`/api/v1/forms`), Scholarships (`/api/v1/scholarships`)

### Community 155 - "10. Admin Panel & Visual Website Editor"
Cohesion: 0.40
Nodes (5): 10. Admin Panel & Visual Website Editor, 1. Admin Dashboard (`/admin`), 2. Visual Website Editor (Live Edit Mode), Admin Theming, Key Admin Components

### Community 156 - "19. Development Standards & Security"
Cohesion: 0.40
Nodes (5): 19. Development Standards & Security, Backend Standards, Definition of Done, Frontend Standards, Security Standards

### Community 157 - "7. Database — Models & Migrations"
Cohesion: 0.40
Nodes (5): 7. Database — Models & Migrations, Database Migrations (14 files), Database Seeding, Model Registration, Sequelize Models (17 total)

### Community 158 - "9. Authentication & Authorization"
Cohesion: 0.40
Nodes (5): 9. Authentication & Authorization, Admin Password Reset Flow, Authentication Flow, JWT Configuration, Role-Based Access Control (RBAC)

### Community 159 - "13. SEO & Performance"
Cohesion: 0.50
Nodes (4): 13. SEO & Performance, Image Optimization, Performance Targets, SEO Implementation

### Community 160 - "14. Deployment & Infrastructure"
Cohesion: 0.50
Nodes (4): 14. Deployment & Infrastructure, Deployment Flow, Production Architecture, Supabase Image Hosting

### Community 161 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (`server/`), Frontend (`client/`), Infrastructure & Services

### Community 162 - "6. Backend — `server/`"
Cohesion: 0.50
Nodes (4): 6. Backend — `server/`, Entry Point & Startup, Error Handling Architecture, Utility Services

## Knowledge Gaps
- **539 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig`, `nextConfig`, `name` (+534 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `adminApiFetch` to `EditableText.tsx`, `ResultsClient.tsx`, `lib/roles.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `🏆 Success Code Academy — Master Project Documentation` connect `🏆 Success Code Academy — Master Project Documentation` to `14. Deployment & Infrastructure`, `3. Technology Stack`, `18. Getting Started — Local Development`, `5. Frontend — `client/``, `6. Backend — `server/``, `11. Website Pages & Features`, `12. Design System & Branding`, `17. Environment Variables Reference`, `8. API Routes & Endpoints`, `10. Admin Panel & Visual Website Editor`, `19. Development Standards & Security`, `7. Database — Models & Migrations`, `9. Authentication & Authorization`, `13. SEO & Performance`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `Success Code Academy NEET Coaching Website - Project Master Context` connect `Success Code Academy NEET Coaching Website - Project Master Context` to `5.2 Courses Page`, `5.4 Test Series Page`, `9. Backend Modules & Data Models`, `17. Environment Variables`, `5.7 Blogs & Reviews`, `7. Student Login Portal`, `Success Code Academy Admin Guide`, `8. Admin / CMS Requirements`, `5.3 Scholarships Page`, `14. Implementation Phases`, `2.2 Core Technology Stack`, `5.5 Student Hub`, `12. Forms, Leads & Conversion Rules`, `13. Payment & Access Control`, `15. Development Standards`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig` to the rest of the system?**
  _539 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06144393241167435 - nodes in this community are weakly interconnected._
- **Should `admin.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `ResultsClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0728744939271255 - nodes in this community are weakly interconnected._