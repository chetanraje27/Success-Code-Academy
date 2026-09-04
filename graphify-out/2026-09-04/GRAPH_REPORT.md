# Graph Report - Success-Code-Academy  (2026-09-04)

## Corpus Check
- 249 files · ~3,739,567 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1345 nodes · 2216 edges · 158 communities (110 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88d20c20`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin.routes.ts
- admin/layout.tsx
- home.ts
- admin.controller.ts
- ResultsClient.tsx
- server/package.json
- AdminLeadTable.tsx
- ScholarshipRegistration.ts
- auth.controller.ts
- devDependencies
- faq-data.ts
- ContentBlock.ts
- EditModeContext.tsx
- compilerOptions
- settings/page.tsx
- Backend Foundation — Complete File-by-File Summary
- EditableText.tsx
- AcademyInsights.tsx
- HomeClient.tsx
- compilerOptions
- AdminContentManager.tsx
- Header.tsx
- seedDatabase.ts
- dependencies
- MediaRevision.ts
- StarStudent.ts
- content.routes.ts
- api.ts
- admin/[...path]/route.ts
- Success Code Academy NEET Coaching Website - Project Master Context
- CourseRegistration.ts
- models/index.ts
- getListOptions
- opencode.json
- Writing Guidelines for Postgres References
- replacePaths.js
- public/[...path]/route.ts
- app/layout.tsx
- User
- [pageKey]/route.ts
- adminApiFetch
- 🏆 Success Code Academy — Master Project Documentation
- ContactClient.tsx
- admin/page.tsx
- 11. Website Pages & Features
- BannerEditor.tsx
- NewsArticle.ts
- test-render.js
- Card.tsx
- IconButton.tsx
- PageHeader.tsx
- SectionHeading.tsx
- middleware.ts
- graphify.js
- 1. Project Overview
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
- Banner.ts
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
1. `adminApiFetch()` - 48 edges
2. `Success Code Academy NEET Coaching Website - Project Master Context` - 32 edges
3. `🏆 Success Code Academy — Master Project Documentation` - 22 edges
4. `useEditModeOptional()` - 21 edges
5. `compilerOptions` - 20 edges
6. `sendMail()` - 18 edges
7. `EditableText()` - 16 edges
8. `compilerOptions` - 16 edges
9. `AdminModal()` - 15 edges
10. `useEditMode()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AdmissionsClient()` --calls--> `useEditModeOptional()`  [EXTRACTED]
  client/src/app/(main)/admissions/AdmissionsClient.tsx → client/src/components/admin/EditModeContext.tsx
- `ContactClient()` --calls--> `usePageBanner()`  [EXTRACTED]
  client/src/app/(main)/contact/ContactClient.tsx → client/src/lib/use-page-banner.ts
- `generateMetadata()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CourseDetailPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CoursesPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/page.tsx → client/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (158 total, 48 thin omitted)

### Community 0 - "admin.routes.ts"
Cohesion: 0.06
Nodes (56): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), SUPER_ADMIN, authenticate, ADMIN_ROLE_SET, authorize() (+48 more)

### Community 1 - "admin/layout.tsx"
Cohesion: 0.14
Nodes (21): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), AdminLayout(), AdminTheme, allNavItems, navigation (+13 more)

### Community 2 - "home.ts"
Cohesion: 0.18
Nodes (10): Course, courses, NavLink, NewsItem, newsItems, overviewFeatures, Statistic, statistics (+2 more)

### Community 3 - "admin.controller.ts"
Cohesion: 0.04
Nodes (63): ADMIN_PUBLIC_ATTRIBUTES, assertNotLastSuperAdmin(), countSuperAdmins(), createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm (+55 more)

### Community 4 - "ResultsClient.tsx"
Cohesion: 0.14
Nodes (10): AdmissionsClient(), metadata, metadata, ResultsClient(), videoStories, resultsData, StudentResult, PAGE_BANNER_MAP (+2 more)

### Community 5 - "server/package.json"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 6 - "AdminLeadTable.tsx"
Cohesion: 0.27
Nodes (9): AdminDetailDrawer(), AdminDetailDrawerProps, AdminDrawerField, AdminLeadTable(), csvCell(), LeadColumn, LeadRow, useAdminSession() (+1 more)

### Community 7 - "ScholarshipRegistration.ts"
Cohesion: 0.50
Nodes (4): initScholarshipRegistration(), ScholarshipRegistration, ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes

### Community 8 - "auth.controller.ts"
Cohesion: 0.05
Nodes (82): appBaseUrl(), requestSelfPasswordReset, sendAdminPasswordReset, AuthPurpose, changeAdminPassword, checkMobileOrLogin, createToken(), forgotAdminPassword (+74 more)

### Community 9 - "devDependencies"
Cohesion: 0.05
Nodes (37): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, devDependencies (+29 more)

### Community 10 - "faq-data.ts"
Cohesion: 0.28
Nodes (5): FaqItem, FaqSection, faqSections, FaqClient(), metadata

### Community 11 - "ContentBlock.ts"
Cohesion: 0.40
Nodes (5): ContentBlock, ContentBlockAttributes, ContentBlockCreationAttributes, ContentBlockKind, initContentBlock()

### Community 12 - "EditModeContext.tsx"
Cohesion: 0.24
Nodes (8): metadata, EditModeContext, EditModeContextValue, EditModeProvider(), useLiveContent(), LiveEditorToolbar(), pageName(), CookieConsent()

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (29): dist, ES2022, node, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+21 more)

### Community 14 - "settings/page.tsx"
Cohesion: 0.10
Nodes (23): AdminLoginPage(), LoginFailure, AdminResetPasswordPage(), TokenState, AdminSettingsPage(), initialSettings, SiteSettings, AdminEmptyState() (+15 more)

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
Cohesion: 0.11
Nodes (20): Course, courseStyles, ExploreCourses(), Announcement, HomeBanner, HomeClient(), PublicContentResponse, renderAnnouncementIcon() (+12 more)

### Community 19 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 20 - "AdminContentManager.tsx"
Cohesion: 0.13
Nodes (10): AdminNotificationsPage(), ICON_PRESETS, renderNotificationIcon(), AdminContentColumn, AdminContentField, AdminContentManager(), FieldValue, initialValues() (+2 more)

### Community 21 - "Header.tsx"
Cohesion: 0.19
Nodes (10): Header(), HeaderUser, mobileNavIcons, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal() (+2 more)

### Community 22 - "seedDatabase.ts"
Cohesion: 0.10
Nodes (25): main(), app, corsOptions, dbConfig, Env, envSchema, parsed, reconcileSchema() (+17 more)

### Community 23 - "dependencies"
Cohesion: 0.05
Nodes (43): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+35 more)

### Community 24 - "MediaRevision.ts"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 25 - "StarStudent.ts"
Cohesion: 0.50
Nodes (4): initStarStudent(), StarStudent, StarStudentAttributes, StarStudentCreationAttributes

### Community 26 - "content.routes.ts"
Cohesion: 0.16
Nodes (12): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes, initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes (+4 more)

### Community 27 - "api.ts"
Cohesion: 0.09
Nodes (30): backendUrl(), DELETE(), GET(), isSameOrigin(), parseBackendResponse(), POST(), PUT(), Course (+22 more)

### Community 28 - "admin/[...path]/route.ts"
Cohesion: 0.24
Nodes (9): backendBase(), DELETE, forward(), GET, HandlerContext, isSameOrigin(), PATCH, POST (+1 more)

### Community 29 - "Success Code Academy NEET Coaching Website - Project Master Context"
Cohesion: 0.09
Nodes (22): 10. SEO, Performance & Technical Requirements, 11. Design & Branding Guidelines, 16. Testing & Quality Checklist, 18. AI Agent Implementation Instructions, 19. Definition of Done, 1. Project Overview, 20. Final Product Direction, 3. Repository Structure (+14 more)

### Community 30 - "CourseRegistration.ts"
Cohesion: 0.50
Nodes (4): CourseRegistration, CourseRegistrationAttributes, CourseRegistrationCreationAttributes, initCourseRegistration()

### Community 31 - "models/index.ts"
Cohesion: 0.09
Nodes (26): AcademyVideo, AcademyVideoAttributes, AcademyVideoCreationAttributes, initAcademyVideo(), AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset() (+18 more)

### Community 32 - "getListOptions"
Cohesion: 0.23
Nodes (13): assertAdminIdentityIsFree(), createAdminAccount, getAdminAccounts, getContactMessages, getCourseForms, getCourses, getListOptions(), getScholarshipForms (+5 more)

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
Cohesion: 0.33
Nodes (4): inter, metadata, plusJakarta, StyledJsxRegistry()

### Community 39 - "User"
Cohesion: 0.50
Nodes (4): initUser(), User, UserAttributes, UserCreationAttributes

### Community 40 - "[pageKey]/route.ts"
Cohesion: 0.60
Nodes (4): backendUrl(), GET(), latestContent, staleContentResponse()

### Community 41 - "adminApiFetch"
Cohesion: 0.20
Nodes (14): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+6 more)

### Community 46 - "🏆 Success Code Academy — Master Project Documentation"
Cohesion: 0.17
Nodes (11): 15. Hosting & Infrastructure Services, 16. Messaging & Notification Services, 17. Environment Variables Reference, 20. Implementation, 2. High-Level Architecture, 4. Repository Structure, Client (`client/.env.local`), Server (`server/.env`) (+3 more)

### Community 47 - "ContactClient.tsx"
Cohesion: 0.17
Nodes (14): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata, EditableSection(), EditableSectionProps, SettingsEditor() (+6 more)

### Community 48 - "admin/page.tsx"
Cohesion: 0.17
Nodes (13): ActivityType, AdminDashboardPage(), CourseBreakdownItem, DashboardStats, formatDate(), formatFullDateTime(), formatNumber(), getInitial() (+5 more)

### Community 49 - "11. Website Pages & Features"
Cohesion: 0.18
Nodes (11): 11. Website Pages & Features, About Page (`/about`), Additional Pages, Admissions Page (`/admissions`), Contact Page (`/contact`), Courses Page (`/courses`), Cross-Cutting Features, FAQ Page (`/faq`) (+3 more)

### Community 50 - "BannerEditor.tsx"
Cohesion: 0.13
Nodes (17): AdminPageBannersPage(), PAGE_SLOTS, PageBannerSlot, Banner, BannerEditor(), BannerEditorProps, Result, ResultEditor() (+9 more)

### Community 51 - "NewsArticle.ts"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 53 - "test-render.js"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 63 - "1. Project Overview"
Cohesion: 0.67
Nodes (3): 1. Project Overview, Key Tagline, Target Audience

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

### Community 88 - "Banner.ts"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

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
- **560 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig`, `nextConfig`, `name` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `adminApiFetch` to `admin/layout.tsx`, `AdminLeadTable.tsx`, `settings/page.tsx`, `ContactClient.tsx`, `admin/page.tsx`, `EditableText.tsx`, `BannerEditor.tsx`, `AdminContentManager.tsx`, `api.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Success Code Academy NEET Coaching Website - Project Master Context` connect `Success Code Academy NEET Coaching Website - Project Master Context` to `5.2 Courses Page`, `5.4 Test Series Page`, `9. Backend Modules & Data Models`, `17. Environment Variables`, `5.7 Blogs & Reviews`, `7. Student Login Portal`, `Success Code Academy Admin Guide`, `8. Admin / CMS Requirements`, `5.3 Scholarships Page`, `14. Implementation Phases`, `2.2 Core Technology Stack`, `5.5 Student Hub`, `12. Forms, Leads & Conversion Rules`, `13. Payment & Access Control`, `15. Development Standards`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `🏆 Success Code Academy — Master Project Documentation` connect `🏆 Success Code Academy — Master Project Documentation` to `14. Deployment & Infrastructure`, `3. Technology Stack`, `5. Frontend — `client/``, `6. Backend — `server/``, `11. Website Pages & Features`, `7. Database — Models & Migrations`, `12. Design System & Branding`, `18. Getting Started — Local Development`, `8. API Routes & Endpoints`, `10. Admin Panel & Visual Website Editor`, `19. Development Standards & Security`, `1. Project Overview`, `9. Authentication & Authorization`, `13. SEO & Performance`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig` to the rest of the system?**
  _560 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.062003968253968256 - nodes in this community are weakly interconnected._
- **Should `admin/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._
- **Should `admin.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04117063492063492 - nodes in this community are weakly interconnected._