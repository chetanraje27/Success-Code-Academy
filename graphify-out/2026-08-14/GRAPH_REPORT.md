# Graph Report - Success-Code-Academy  (2026-08-14)

## Corpus Check
- 232 files · ~3,713,081 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1161 nodes · 1859 edges · 147 communities (98 shown, 49 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3aa43cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin.routes.ts
- seedDatabase.ts
- app.ts
- admin.controller.ts
- api.ts
- server/package.json
- adminApiFetch
- admin/layout.tsx
- EditModeContext.tsx
- devDependencies
- lib/roles.ts
- AdminContentManager.tsx
- SettingsEditor.tsx
- compilerOptions
- auth.routes.ts
- Backend Foundation — Complete File-by-File Summary
- EditableText.tsx
- AcademyInsights.tsx
- HomeClient.tsx
- compilerOptions
- AdminModal.tsx
- Header.tsx
- ResultsClient.tsx
- dependencies
- MediaRevision.ts
- AdminUi.tsx
- ScholarshipRegistration.ts
- recordMediaRevision
- admin/[...path]/route.ts
- Success Code Academy NEET Coaching Website - Project Master Context
- StarStudent.ts
- assertNotLastSuperAdmin
- getListOptions
- mailer.ts
- opencode.json
- Writing Guidelines for Postgres References
- replacePaths.js
- public/[...path]/route.ts
- app/layout.tsx
- ContentBlock.ts
- [pageKey]/route.ts
- AdmissionsClient.tsx
- AcademyVideo.ts
- AdminPasswordReset.ts
- Banner.ts
- CourseRegistration.ts
- NewsArticle.ts
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
- content.routes.ts
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
- `isAdminUser()` --calls--> `isAdminRole()`  [EXTRACTED]
  client/src/lib/api.ts → client/src/lib/roles.ts
- `generateMetadata()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CourseDetailPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CoursesPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/page.tsx → client/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (147 total, 49 thin omitted)

### Community 0 - "admin.routes.ts"
Cohesion: 0.06
Nodes (55): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), SUPER_ADMIN, ADMIN_ROLE_SET, authorize(), Admin (+47 more)

### Community 1 - "seedDatabase.ts"
Cohesion: 0.29
Nodes (8): main(), scheduleDatabaseReconnect(), startServer(), sequelize, testConnection(), claimMobileNumber(), seedDatabase(), seedSuperAdmin()

### Community 2 - "app.ts"
Cohesion: 0.13
Nodes (15): app, corsOptions, dbConfig, appBaseUrl(), Env, envSchema, parsed, errorHandler() (+7 more)

### Community 3 - "admin.controller.ts"
Cohesion: 0.05
Nodes (42): ADMIN_PUBLIC_ATTRIBUTES, createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm, createNewsArticle, createNotification (+34 more)

### Community 4 - "api.ts"
Cohesion: 0.13
Nodes (14): Course, CoursesClient(), classroomFeatures, CourseDetailClient(), CourseDetailClientProps, courseVisuals, timeSlots, CourseDetailPage() (+6 more)

### Community 5 - "server/package.json"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 6 - "adminApiFetch"
Cohesion: 0.17
Nodes (18): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+10 more)

### Community 7 - "admin/layout.tsx"
Cohesion: 0.14
Nodes (21): AdminLayout(), AdminTheme, navigation, routeNames, SessionState, AdminLoginPage(), backendUrl(), DELETE() (+13 more)

### Community 8 - "EditModeContext.tsx"
Cohesion: 0.22
Nodes (9): metadata, EditModeContext, EditModeContextValue, LeadsDrawer(), useLiveContent(), LiveEditorToolbar(), pageName(), CookieConsent() (+1 more)

### Community 9 - "devDependencies"
Cohesion: 0.05
Nodes (37): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, devDependencies (+29 more)

### Community 10 - "lib/roles.ts"
Cohesion: 0.32
Nodes (9): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), ADMIN, ADMIN_ROLES, AdminRole, adminRoleLabel() (+1 more)

### Community 11 - "AdminContentManager.tsx"
Cohesion: 0.11
Nodes (12): AdminNotificationsPage(), ICON_PRESETS, renderNotificationIcon(), AdminContentColumn, AdminContentField, AdminContentManager(), FieldValue, initialValues() (+4 more)

### Community 12 - "SettingsEditor.tsx"
Cohesion: 0.17
Nodes (15): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata, EditableSection(), EditableSectionProps, SettingsEditor() (+7 more)

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (29): dist, ES2022, node, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+21 more)

### Community 14 - "auth.routes.ts"
Cohesion: 0.07
Nodes (41): AuthPurpose, changeAdminPassword, checkMobileOrLogin, createToken(), getCurrentUser, loginAdmin, publicAdmin(), publicUser() (+33 more)

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

### Community 20 - "AdminModal.tsx"
Cohesion: 0.15
Nodes (21): AdminModal(), Banner, BannerEditor(), BannerEditorProps, useEditMode(), ICON_PRESETS, Notification, NotificationEditor() (+13 more)

### Community 21 - "Header.tsx"
Cohesion: 0.10
Nodes (20): Header(), HeaderUser, mobileNavIcons, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal() (+12 more)

### Community 22 - "ResultsClient.tsx"
Cohesion: 0.24
Nodes (5): metadata, ResultsClient(), videoStories, resultsData, StudentResult

### Community 23 - "dependencies"
Cohesion: 0.05
Nodes (41): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+33 more)

### Community 24 - "MediaRevision.ts"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 25 - "AdminUi.tsx"
Cohesion: 0.16
Nodes (15): AdminDashboardPage(), DashboardStats, quickActions, RecentStudent, TokenState, AdminSettingsPage(), initialSettings, SiteSettings (+7 more)

### Community 26 - "ScholarshipRegistration.ts"
Cohesion: 0.50
Nodes (4): initScholarshipRegistration(), ScholarshipRegistration, ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes

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

### Community 33 - "mailer.ts"
Cohesion: 0.28
Nodes (8): sendAdminPasswordReset, issueAdminPasswordReset(), deliver(), isMailerConfigured(), MailMessage, MailResult, TODO: create a nodemailer transport from SMTP_HOST / SMTP_PORT /, sendMail()

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

### Community 43 - "AdminPasswordReset.ts"
Cohesion: 0.50
Nodes (4): AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset()

### Community 44 - "Banner.ts"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

### Community 46 - "CourseRegistration.ts"
Cohesion: 0.50
Nodes (4): CourseRegistration, CourseRegistrationAttributes, CourseRegistrationCreationAttributes, initCourseRegistration()

### Community 47 - "NewsArticle.ts"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 50 - "SiteSetting.ts"
Cohesion: 0.50
Nodes (4): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes

### Community 51 - "TopperResult.ts"
Cohesion: 0.50
Nodes (4): initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes

### Community 52 - "models/index.ts"
Cohesion: 0.13
Nodes (18): ContactMessage, ContactMessageAttributes, ContactMessageCreationAttributes, initContactMessage(), Course, initCourse(), initNotification(), Notification (+10 more)

### Community 53 - "test-render.js"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 56 - "getSupabase"
Cohesion: 0.50
Nodes (4): getSignedUploadUrl, getSupabase(), upload, uploadImage

### Community 63 - "publicStudent"
Cohesion: 0.67
Nodes (3): createUser, publicStudent(), updateUser

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

### Community 88 - "content.routes.ts"
Cohesion: 0.31
Nodes (5): asyncHandler(), AsyncRouteHandler, isTransientDatabaseError(), readFromDatabase(), TRANSIENT_DATABASE_ERRORS

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

## Knowledge Gaps
- **459 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig`, `nextConfig`, `name` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `adminApiFetch` to `api.ts`, `EditModeContext.tsx`, `lib/roles.ts`, `AdminContentManager.tsx`, `SettingsEditor.tsx`, `EditableText.tsx`, `AdminModal.tsx`, `AdminUi.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `isAdminRole()` connect `admin/layout.tsx` to `EditModeContext.tsx`, `lib/roles.ts`, `api.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Success Code Academy NEET Coaching Website - Project Master Context` connect `Success Code Academy NEET Coaching Website - Project Master Context` to `5.2 Courses Page`, `5.4 Test Series Page`, `9. Backend Modules & Data Models`, `17. Environment Variables`, `5.7 Blogs & Reviews`, `7. Student Login Portal`, `Success Code Academy Admin Guide`, `8. Admin / CMS Requirements`, `5.3 Scholarships Page`, `14. Implementation Phases`, `2.2 Core Technology Stack`, `5.5 Student Hub`, `12. Forms, Leads & Conversion Rules`, `13. Payment & Access Control`, `15. Development Standards`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig` to the rest of the system?**
  _459 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06240084611316764 - nodes in this community are weakly interconnected._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Should `admin.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04983388704318937 - nodes in this community are weakly interconnected._