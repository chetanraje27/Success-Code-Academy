# Graph Report - Success-Code-Academy  (2026-08-14)

## Corpus Check
- 230 files · ~3,712,349 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1152 nodes · 1852 edges · 143 communities (96 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75bedccf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin.routes.ts
- form.routes.ts
- auth.routes.ts
- ResultsClient.tsx
- admin.controller.ts
- EditModeContext.tsx
- server/package.json
- AdminContentManager.tsx
- adminApiFetch
- devDependencies
- AdminLeadTable.tsx
- SettingsEditor.tsx
- useEditMode
- compilerOptions
- ToppersCarousel.tsx
- HomeClient.tsx
- home.ts
- AcademyInsights.tsx
- compilerOptions
- Backend Foundation — Complete File-by-File Summary
- dependencies
- MediaRevision.ts
- useEditModeOptional
- Success Code Academy NEET Coaching Website - Project Master Context
- recordMediaRevision
- admin/[...path]/route.ts
- Writing Guidelines for Postgres References
- EditableText.tsx
- Notification
- assertNotLastSuperAdmin
- getListOptions
- Section Definitions
- replacePaths.js
- public/[...path]/route.ts
- app/layout.tsx
- ContentBlock.ts
- [pageKey]/route.ts
- AdmissionsClient.tsx
- content.routes.ts
- models/index.ts
- Banner.ts
- ContactMessage.ts
- CourseRegistration.ts
- NewsArticle.ts
- OtpVerification.ts
- ScholarshipRegistration.ts
- SiteSetting.ts
- Success Code Academy Admin Guide
- TopperResult.ts
- v1/index.ts
- test-render.js
- Card.tsx
- [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02)
- getSupabase
- Supabase Postgres Best Practices
- IconButton.tsx
- PageHeader.tsx
- SectionHeading.tsx
- middleware.ts
- graphify.js
- publicStudent
- loadSettingsMap
- environment.d.ts
- express.d.ts
- test-db.js
- eslint.config.mjs
- next.config.ts
- 5.3 Scholarships Page
- 14. Implementation Phases
- 2.2 Core Technology Stack
- 5.5 Student Hub
- client/README.md
- 12. Forms, Leads & Conversion Rules
- 13. Payment & Access Control
- 15. Development Standards
- 5.2 Courses Page
- check.js
- 5.4 Test Series Page
- 9. Backend Modules & Data Models
- 17. Environment Variables
- 5.7 Blogs & Reviews
- 7. Student Login Portal
- 8. Admin / CMS Requirements
- AGENTS.md
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
- client/AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `adminApiFetch()` - 47 edges
2. `Success Code Academy NEET Coaching Website - Project Master Context` - 32 edges
3. `compilerOptions` - 20 edges
4. `useEditModeOptional()` - 19 edges
5. `EditableText()` - 16 edges
6. `compilerOptions` - 16 edges
7. `AdminModal()` - 15 edges
8. `useEditMode()` - 15 edges
9. `AdminContentManager()` - 12 edges
10. `isAdminRole()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdminSettingsPage()` --calls--> `adminApiFetch()`  [EXTRACTED]
  client/src/app/admin/settings/page.tsx → client/src/lib/admin-api.ts
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

## Communities (143 total, 47 thin omitted)

### Community 0 - "admin.routes.ts"
Cohesion: 0.06
Nodes (55): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), authenticate, ADMIN_ROLE_SET, authorize(), Admin (+47 more)

### Community 1 - "form.routes.ts"
Cohesion: 0.16
Nodes (13): submitContactForm, submitCourseRegistration, createRegistration, submissionLimiter, validate(), ValidationTarget, contactFormSchema, courseRegistrationSchema (+5 more)

### Community 2 - "auth.routes.ts"
Cohesion: 0.06
Nodes (55): main(), app, corsOptions, dbConfig, appBaseUrl(), Env, envSchema, parsed (+47 more)

### Community 3 - "ResultsClient.tsx"
Cohesion: 0.06
Nodes (35): AdminLoginPage(), backendUrl(), DELETE(), GET(), isSameOrigin(), parseBackendResponse(), POST(), PUT() (+27 more)

### Community 4 - "admin.controller.ts"
Cohesion: 0.05
Nodes (39): ADMIN_PUBLIC_ATTRIBUTES, createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm, createNewsArticle, createNotification (+31 more)

### Community 5 - "EditModeContext.tsx"
Cohesion: 0.13
Nodes (23): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), AdminLayout(), AdminTheme, navigation, routeNames (+15 more)

### Community 6 - "server/package.json"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 7 - "AdminContentManager.tsx"
Cohesion: 0.12
Nodes (11): AdminNotificationsPage(), ICON_PRESETS, renderNotificationIcon(), AdminContentColumn, AdminContentField, AdminContentManager(), FieldValue, initialValues() (+3 more)

### Community 8 - "adminApiFetch"
Cohesion: 0.20
Nodes (14): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+6 more)

### Community 9 - "devDependencies"
Cohesion: 0.05
Nodes (37): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, devDependencies (+29 more)

### Community 10 - "AdminLeadTable.tsx"
Cohesion: 0.13
Nodes (21): AdminDashboardPage(), DashboardStats, quickActions, RecentStudent, TokenState, AdminSettingsPage(), initialSettings, SiteSettings (+13 more)

### Community 11 - "SettingsEditor.tsx"
Cohesion: 0.17
Nodes (15): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata, EditableSection(), EditableSectionProps, SettingsEditor() (+7 more)

### Community 12 - "useEditMode"
Cohesion: 0.19
Nodes (15): Banner, BannerEditor(), BannerEditorProps, useEditMode(), Result, ResultEditor(), ACTION_LABELS, MediaResourceType (+7 more)

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (29): dist, ES2022, node, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+21 more)

### Community 14 - "ToppersCarousel.tsx"
Cohesion: 0.38
Nodes (5): ParsedResult, parseResult(), resolveImageSource(), StarStudent, ToppersCarousel()

### Community 15 - "HomeClient.tsx"
Cohesion: 0.12
Nodes (13): Course, courseStyles, ExploreCourses(), Announcement, HomeBanner, HomeClient(), PublicContentResponse, renderAnnouncementIcon() (+5 more)

### Community 16 - "home.ts"
Cohesion: 0.11
Nodes (18): HeaderUser, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal(), SignInModalProps, Course (+10 more)

### Community 17 - "AcademyInsights.tsx"
Cohesion: 0.18
Nodes (11): categoryConfig, GalleryPage(), VideoItem, videoItems, AcademyInsights(), BlogItem, VideoItem, InstagramEmbed() (+3 more)

### Community 18 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 19 - "Backend Foundation — Complete File-by-File Summary"
Cohesion: 0.06
Nodes (35): Backend Foundation — Complete File-by-File Summary, Commit 1 + 2: TypeScript Config Fix + Environment Configuration, Commit 3: Logger Setup, Commit 4: Error Handling Infrastructure, Commit 5: Database Connection, Commit 6: Core Middleware Stack, Commit 7: Authentication Middleware, Commit 8: Routes, Controllers & App Assembly (+27 more)

### Community 20 - "dependencies"
Cohesion: 0.05
Nodes (41): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+33 more)

### Community 21 - "MediaRevision.ts"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 22 - "useEditModeOptional"
Cohesion: 0.33
Nodes (7): metadata, useEditModeOptional(), useLiveContent(), LiveEditorToolbar(), pageName(), CookieConsent(), Header()

### Community 23 - "Success Code Academy NEET Coaching Website - Project Master Context"
Cohesion: 0.09
Nodes (22): 10. SEO, Performance & Technical Requirements, 11. Design & Branding Guidelines, 16. Testing & Quality Checklist, 18. AI Agent Implementation Instructions, 19. Definition of Done, 1. Project Overview, 20. Final Product Direction, 3. Repository Structure (+14 more)

### Community 24 - "recordMediaRevision"
Cohesion: 0.18
Nodes (11): deleteAcademyVideo, deleteBanner, deleteNewsArticle, deleteResult, deleteStarStudent, recordMediaRevision(), updateAcademyVideo, updateBanner (+3 more)

### Community 25 - "admin/[...path]/route.ts"
Cohesion: 0.24
Nodes (9): backendBase(), DELETE, forward(), GET, HandlerContext, isSameOrigin(), PATCH, POST (+1 more)

### Community 26 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 27 - "EditableText.tsx"
Cohesion: 0.20
Nodes (12): EditableTextProps, ContentKind, ContentMap, ContentOverride, ContentScope, fetchContentMap(), LiveContentContext, LiveContentContextValue (+4 more)

### Community 28 - "Notification"
Cohesion: 0.50
Nodes (4): initNotification(), Notification, NotificationAttributes, NotificationCreationAttributes

### Community 29 - "assertNotLastSuperAdmin"
Cohesion: 0.29
Nodes (8): assertAdminIdentityIsFree(), assertNotLastSuperAdmin(), countSuperAdmins(), createAdminAccount, deleteAdminAccount, getAdminAccounts, publicAdminAccount(), updateAdminAccount

### Community 30 - "getListOptions"
Cohesion: 0.39
Nodes (8): getContactMessages, getCourseForms, getCourses, getListOptions(), getScholarshipForms, getUsers, searchLeads, sendPaginated()

### Community 31 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 32 - "replacePaths.js"
Cohesion: 0.33
Nodes (3): directoryMap, fs, path

### Community 33 - "public/[...path]/route.ts"
Cohesion: 0.60
Nodes (5): backendBase(), GET(), POST(), proxy(), PUT()

### Community 34 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, StyledJsxRegistry()

### Community 35 - "ContentBlock.ts"
Cohesion: 0.40
Nodes (5): ContentBlock, ContentBlockAttributes, ContentBlockCreationAttributes, ContentBlockKind, initContentBlock()

### Community 36 - "[pageKey]/route.ts"
Cohesion: 0.60
Nodes (4): backendUrl(), GET(), latestContent, staleContentResponse()

### Community 38 - "content.routes.ts"
Cohesion: 0.27
Nodes (7): AcademyVideo, AcademyVideoAttributes, AcademyVideoCreationAttributes, initAcademyVideo(), isTransientDatabaseError(), readFromDatabase(), TRANSIENT_DATABASE_ERRORS

### Community 39 - "models/index.ts"
Cohesion: 0.15
Nodes (15): AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset(), Course, initCourse(), sequelize, initStarStudent() (+7 more)

### Community 40 - "Banner.ts"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

### Community 41 - "ContactMessage.ts"
Cohesion: 0.50
Nodes (4): ContactMessage, ContactMessageAttributes, ContactMessageCreationAttributes, initContactMessage()

### Community 42 - "CourseRegistration.ts"
Cohesion: 0.50
Nodes (4): CourseRegistration, CourseRegistrationAttributes, CourseRegistrationCreationAttributes, initCourseRegistration()

### Community 43 - "NewsArticle.ts"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 44 - "OtpVerification.ts"
Cohesion: 0.50
Nodes (4): initOtpVerification(), OtpVerification, OtpVerificationAttributes, OtpVerificationCreationAttributes

### Community 45 - "ScholarshipRegistration.ts"
Cohesion: 0.50
Nodes (4): initScholarshipRegistration(), ScholarshipRegistration, ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes

### Community 46 - "SiteSetting.ts"
Cohesion: 0.50
Nodes (4): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes

### Community 47 - "Success Code Academy Admin Guide"
Cohesion: 0.22
Nodes (7): Admin dashboard, Safe editing habits, Sign in, Success Code Academy Admin Guide, Troubleshooting, Two ways to update the website, Visual website editor

### Community 48 - "TopperResult.ts"
Cohesion: 0.50
Nodes (4): initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes

### Community 49 - "v1/index.ts"
Cohesion: 0.36
Nodes (5): getHealth, router, router, router, v1Router

### Community 50 - "test-render.js"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 52 - "[1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02)"
Cohesion: 0.25
Nodes (7): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), Bug Fixes, Bug Fixes, Changelog, Features, Features

### Community 53 - "getSupabase"
Cohesion: 0.50
Nodes (4): getSignedUploadUrl, getSupabase(), upload, uploadImage

### Community 54 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 61 - "publicStudent"
Cohesion: 0.67
Nodes (3): createUser, publicStudent(), updateUser

### Community 62 - "loadSettingsMap"
Cohesion: 0.67
Nodes (3): getSettings, loadSettingsMap(), updateSettings

### Community 77 - "5.3 Scholarships Page"
Cohesion: 0.33
Nodes (6): 5.3 Scholarships Page, Scholarship Achievements, Scholarship Exam Detail Page, Scholarship FAQs, Scholarship Listing, Scholarship Preparation

### Community 78 - "14. Implementation Phases"
Cohesion: 0.40
Nodes (5): 14. Implementation Phases, Phase 1 Build Order, Phase 2 Build Order, Phase 3 Build Order, Phase 4 Build Order

### Community 79 - "2.2 Core Technology Stack"
Cohesion: 0.40
Nodes (5): 2.1 Deployment Environment - Current Phase, 2.2 Core Technology Stack, 2. Architecture & Technology Stack, Backend - `server/`, Frontend - `client/`

### Community 80 - "5.5 Student Hub"
Cohesion: 0.40
Nodes (5): 5.5 Student Hub, NCERT Solutions, NEET Answer Key, Study Material, Success Code Academy G-Books

### Community 81 - "client/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 82 - "12. Forms, Leads & Conversion Rules"
Cohesion: 0.50
Nodes (4): 12. Forms, Leads & Conversion Rules, Conversion Rules, Form Requirements, Public Forms

### Community 83 - "13. Payment & Access Control"
Cohesion: 0.50
Nodes (4): 13. Payment & Access Control, Access Control, Payment Use Cases, Required Flow

### Community 84 - "15. Development Standards"
Cohesion: 0.50
Nodes (4): 15. Development Standards, Backend Standards, Frontend Standards, Security Standards

### Community 85 - "5.2 Courses Page"
Cohesion: 0.50
Nodes (4): 5.2 Courses Page, Course Categories, Course Detail Page Requirements, Course Listing Requirements

### Community 87 - "5.4 Test Series Page"
Cohesion: 0.50
Nodes (4): 5.4 Test Series Page, Student Test Dashboard, Test Series Categories, Test Series Detail Page

### Community 88 - "9. Backend Modules & Data Models"
Cohesion: 0.50
Nodes (4): 9. Backend Modules & Data Models, API Design Rules, Core Models, Example API Routes

### Community 89 - "17. Environment Variables"
Cohesion: 0.67
Nodes (3): 17. Environment Variables, Client, Server

### Community 90 - "5.7 Blogs & Reviews"
Cohesion: 0.67
Nodes (3): 5.7 Blogs & Reviews, Blog Section, Student Reviews

### Community 104 - "7. Student Login Portal"
Cohesion: 0.67
Nodes (3): 7. Student Login Portal, Authentication, Student Dashboard Features

### Community 105 - "8. Admin / CMS Requirements"
Cohesion: 0.67
Nodes (3): 8. Admin / CMS Requirements, Admin Roles, CMS Features

## Knowledge Gaps
- **454 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+449 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `adminApiFetch` to `ResultsClient.tsx`, `EditModeContext.tsx`, `AdminContentManager.tsx`, `AdminLeadTable.tsx`, `SettingsEditor.tsx`, `useEditMode`, `EditableText.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Success Code Academy NEET Coaching Website - Project Master Context` connect `Success Code Academy NEET Coaching Website - Project Master Context` to `7. Student Login Portal`, `8. Admin / CMS Requirements`, `5.3 Scholarships Page`, `14. Implementation Phases`, `Success Code Academy Admin Guide`, `2.2 Core Technology Stack`, `5.5 Student Hub`, `12. Forms, Leads & Conversion Rules`, `13. Payment & Access Control`, `15. Development Standards`, `5.2 Courses Page`, `5.4 Test Series Page`, `9. Backend Modules & Data Models`, `17. Environment Variables`, `5.7 Blogs & Reviews`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `AppError` connect `auth.routes.ts` to `admin.routes.ts`, `admin.controller.ts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _454 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0629800307219662 - nodes in this community are weakly interconnected._
- **Should `auth.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `ResultsClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06184012066365008 - nodes in this community are weakly interconnected._