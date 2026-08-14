# Graph Report - Success-Code-Academy  (2026-08-14)

## Corpus Check
- 230 files · ~3,712,349 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 910 nodes · 1657 edges · 104 communities (78 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a34491e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- adminApiFetch
- admin.routes.ts
- auth.routes.ts
- AdminContentManager.tsx
- seedDatabase.ts
- admin.controller.ts
- lib/roles.ts
- server/package.json
- dependencies
- EditableText.tsx
- SettingsEditor.tsx
- compilerOptions
- HomeClient.tsx
- Header.tsx
- ResultsClient.tsx
- AcademyInsights.tsx
- compilerOptions
- devDependencies
- AdminLeadTable.tsx
- User
- dependencies
- MediaRevision.ts
- home.ts
- recordMediaRevision
- admin/[...path]/route.ts
- server/tsconfig.json
- assertNotLastSuperAdmin
- getListOptions
- include
- replacePaths.js
- public/[...path]/route.ts
- app/layout.tsx
- ContentBlock.ts
- [pageKey]/route.ts
- AcademyVideo.ts
- AdminPasswordReset.ts
- Banner.ts
- ContactMessage.ts
- CourseRegistration.ts
- NewsArticle.ts
- models/index.ts
- OtpVerification.ts
- ScholarshipRegistration.ts
- SiteSetting.ts
- StarStudent.ts
- TopperResult.ts
- AdminModal.tsx
- test-render.js
- Card.tsx
- lib
- getSupabase
- @types/node
- IconButton.tsx
- PageHeader.tsx
- SectionHeading.tsx
- middleware.ts
- publicStudent
- loadSettingsMap
- environment.d.ts
- express.d.ts
- test-db.js
- eslint.config.mjs
- next.config.ts
- dotenv
- express
- helmet
- jsonwebtoken
- multer
- pg
- pg-hstore
- lib
- sequelize
- check.js
- @supabase/supabase-js
- @types/bcrypt
- @types/jsonwebtoken
- winston
- EditModeContext.tsx
- LiveContentContext.tsx
- AdmissionsClient.tsx
- graphify.js

## God Nodes (most connected - your core abstractions)
1. `adminApiFetch()` - 47 edges
2. `compilerOptions` - 20 edges
3. `useEditModeOptional()` - 19 edges
4. `EditableText()` - 16 edges
5. `compilerOptions` - 16 edges
6. `AdminModal()` - 15 edges
7. `useEditMode()` - 15 edges
8. `recordMediaRevision()` - 12 edges
9. `AdminContentManager()` - 12 edges
10. `isAdminRole()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdminSettingsPage()` --calls--> `adminApiFetch()`  [EXTRACTED]
  client/src/app/admin/settings/page.tsx → client/src/lib/admin-api.ts
- `isAdminUser()` --calls--> `isAdminRole()`  [EXTRACTED]
  client/src/lib/api.ts → client/src/lib/roles.ts
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  server/tsconfig.json → client/tsconfig.json
- `AdminCoursesPage()` --calls--> `adminApiFetch()`  [EXTRACTED]
  client/src/app/admin/content/courses/page.tsx → client/src/lib/admin-api.ts
- `AdminContactMessagesPage()` --calls--> `adminApiFetch()`  [EXTRACTED]
  client/src/app/admin/database/contact-messages/page.tsx → client/src/lib/admin-api.ts

## Import Cycles
- None detected.

## Communities (104 total, 26 thin omitted)

### Community 0 - "adminApiFetch"
Cohesion: 0.18
Nodes (15): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+7 more)

### Community 1 - "admin.routes.ts"
Cohesion: 0.06
Nodes (55): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), authenticate, ADMIN_ROLE_SET, authorize(), Admin (+47 more)

### Community 2 - "auth.routes.ts"
Cohesion: 0.06
Nodes (45): AuthPurpose, changeAdminPassword, checkMobileOrLogin, createToken(), getCurrentUser, loginAdmin, publicAdmin(), publicUser() (+37 more)

### Community 3 - "AdminContentManager.tsx"
Cohesion: 0.11
Nodes (13): AdminNotificationsPage(), ICON_PRESETS, renderNotificationIcon(), AdminContentColumn, AdminContentField, AdminContentManager(), FieldValue, initialValues() (+5 more)

### Community 4 - "seedDatabase.ts"
Cohesion: 0.08
Nodes (32): main(), app, corsOptions, dbConfig, appBaseUrl(), Env, envSchema, parsed (+24 more)

### Community 5 - "admin.controller.ts"
Cohesion: 0.05
Nodes (39): ADMIN_PUBLIC_ATTRIBUTES, createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm, createNewsArticle, createNotification (+31 more)

### Community 6 - "lib/roles.ts"
Cohesion: 0.11
Nodes (29): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), AdminLayout(), AdminTheme, navigation, routeNames (+21 more)

### Community 7 - "server/package.json"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, name (+14 more)

### Community 9 - "EditableText.tsx"
Cohesion: 0.18
Nodes (12): courseStyles, ExploreCourses(), ParsedResult, parseResult(), resolveImageSource(), StarStudent, ToppersCarousel(), EditableText() (+4 more)

### Community 10 - "SettingsEditor.tsx"
Cohesion: 0.17
Nodes (15): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata, EditableSection(), EditableSectionProps, SettingsEditor() (+7 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (20): node, compilerOptions, declaration, declarationMap, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+12 more)

### Community 12 - "HomeClient.tsx"
Cohesion: 0.15
Nodes (10): Course, Announcement, HomeBanner, HomeClient(), PublicContentResponse, renderAnnouncementIcon(), ParentsTrustUs(), learningPath (+2 more)

### Community 13 - "Header.tsx"
Cohesion: 0.18
Nodes (10): CookieConsent(), Header(), HeaderUser, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal() (+2 more)

### Community 14 - "ResultsClient.tsx"
Cohesion: 0.07
Nodes (26): Course, CoursesClient(), classroomFeatures, CourseDetailClient(), CourseDetailClientProps, courseVisuals, timeSlots, CourseDetailPage() (+18 more)

### Community 15 - "AcademyInsights.tsx"
Cohesion: 0.18
Nodes (11): categoryConfig, GalleryPage(), VideoItem, videoItems, AcademyInsights(), BlogItem, VideoItem, InstagramEmbed() (+3 more)

### Community 16 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 17 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, next-sitemap, @types/react, @types/react-dom, typescript, next-sitemap (+6 more)

### Community 18 - "AdminLeadTable.tsx"
Cohesion: 0.15
Nodes (17): AdminDashboardPage(), DashboardStats, quickActions, RecentStudent, TokenState, AdminSettingsPage(), initialSettings, SiteSettings (+9 more)

### Community 19 - "User"
Cohesion: 0.50
Nodes (4): initUser(), User, UserAttributes, UserCreationAttributes

### Community 20 - "dependencies"
Cohesion: 0.15
Nodes (13): bcrypt, cors, express-rate-limit, dependencies, bcrypt, cors, express-rate-limit, @types/cors (+5 more)

### Community 21 - "MediaRevision.ts"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 22 - "home.ts"
Cohesion: 0.18
Nodes (10): Course, courses, NavLink, NewsItem, newsItems, overviewFeatures, Statistic, statistics (+2 more)

### Community 23 - "recordMediaRevision"
Cohesion: 0.18
Nodes (11): deleteAcademyVideo, deleteBanner, deleteNewsArticle, deleteResult, deleteStarStudent, recordMediaRevision(), updateAcademyVideo, updateBanner (+3 more)

### Community 24 - "admin/[...path]/route.ts"
Cohesion: 0.24
Nodes (9): backendBase(), DELETE, forward(), GET, HandlerContext, isSameOrigin(), PATCH, POST (+1 more)

### Community 25 - "server/tsconfig.json"
Cohesion: 0.20
Nodes (8): exclude, node_modules, dist, src/**/*, exclude, include, ts-node, files

### Community 26 - "assertNotLastSuperAdmin"
Cohesion: 0.29
Nodes (8): assertAdminIdentityIsFree(), assertNotLastSuperAdmin(), countSuperAdmins(), createAdminAccount, deleteAdminAccount, getAdminAccounts, publicAdminAccount(), updateAdminAccount

### Community 27 - "getListOptions"
Cohesion: 0.39
Nodes (8): getContactMessages, getCourseForms, getCourses, getListOptions(), getScholarshipForms, getUsers, searchLeads, sendPaginated()

### Community 28 - "include"
Cohesion: 0.29
Nodes (7): include, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx

### Community 29 - "replacePaths.js"
Cohesion: 0.33
Nodes (3): directoryMap, fs, path

### Community 30 - "public/[...path]/route.ts"
Cohesion: 0.60
Nodes (5): backendBase(), GET(), POST(), proxy(), PUT()

### Community 31 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, StyledJsxRegistry()

### Community 32 - "ContentBlock.ts"
Cohesion: 0.40
Nodes (5): ContentBlock, ContentBlockAttributes, ContentBlockCreationAttributes, ContentBlockKind, initContentBlock()

### Community 33 - "[pageKey]/route.ts"
Cohesion: 0.60
Nodes (4): backendUrl(), GET(), latestContent, staleContentResponse()

### Community 34 - "AcademyVideo.ts"
Cohesion: 0.50
Nodes (4): AcademyVideo, AcademyVideoAttributes, AcademyVideoCreationAttributes, initAcademyVideo()

### Community 35 - "AdminPasswordReset.ts"
Cohesion: 0.50
Nodes (4): AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset()

### Community 36 - "Banner.ts"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

### Community 37 - "ContactMessage.ts"
Cohesion: 0.50
Nodes (4): ContactMessage, ContactMessageAttributes, ContactMessageCreationAttributes, initContactMessage()

### Community 38 - "CourseRegistration.ts"
Cohesion: 0.50
Nodes (4): CourseRegistration, CourseRegistrationAttributes, CourseRegistrationCreationAttributes, initCourseRegistration()

### Community 39 - "NewsArticle.ts"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 40 - "models/index.ts"
Cohesion: 0.36
Nodes (6): Course, initCourse(), initNotification(), Notification, NotificationAttributes, NotificationCreationAttributes

### Community 41 - "OtpVerification.ts"
Cohesion: 0.50
Nodes (4): initOtpVerification(), OtpVerification, OtpVerificationAttributes, OtpVerificationCreationAttributes

### Community 42 - "ScholarshipRegistration.ts"
Cohesion: 0.50
Nodes (4): initScholarshipRegistration(), ScholarshipRegistration, ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes

### Community 43 - "SiteSetting.ts"
Cohesion: 0.50
Nodes (4): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes

### Community 44 - "StarStudent.ts"
Cohesion: 0.50
Nodes (4): initStarStudent(), StarStudent, StarStudentAttributes, StarStudentCreationAttributes

### Community 45 - "TopperResult.ts"
Cohesion: 0.50
Nodes (4): initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes

### Community 46 - "AdminModal.tsx"
Cohesion: 0.17
Nodes (17): AdminModal(), Banner, BannerEditor(), BannerEditorProps, useEditMode(), LiveContentDialogProps, Result, ResultEditor() (+9 more)

### Community 47 - "test-render.js"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 49 - "lib"
Cohesion: 0.50
Nodes (4): lib, dom, dom.iterable, esnext

### Community 50 - "getSupabase"
Cohesion: 0.50
Nodes (4): getSignedUploadUrl, getSupabase(), upload, uploadImage

### Community 51 - "@types/node"
Cohesion: 0.67
Nodes (3): @types/node, @types/node, @types/node

### Community 57 - "publicStudent"
Cohesion: 0.67
Nodes (3): createUser, publicStudent(), updateUser

### Community 58 - "loadSettingsMap"
Cohesion: 0.67
Nodes (3): getSettings, loadSettingsMap(), updateSettings

### Community 88 - "EditModeContext.tsx"
Cohesion: 0.27
Nodes (7): metadata, EditModeContext, EditModeContextValue, EditModeProvider(), useLiveContent(), LiveEditorToolbar(), pageName()

### Community 89 - "LiveContentContext.tsx"
Cohesion: 0.28
Nodes (8): ContentKind, ContentMap, ContentOverride, fetchContentMap(), LiveContentContext, LiveContentContextValue, LiveContentProvider(), pathnameToPageKey()

## Knowledge Gaps
- **292 isolated node(s):** `Banner`, `BannerEditorProps`, `EditModeContextValue`, `ContentMap`, `ContentOverride` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `adminApiFetch` to `AdminContentManager.tsx`, `lib/roles.ts`, `SettingsEditor.tsx`, `AdminModal.tsx`, `ResultsClient.tsx`, `AdminLeadTable.tsx`, `LiveContentContext.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `server/package.json`, `dotenv`, `express`, `helmet`, `jsonwebtoken`, `multer`, `pg`, `pg-hstore`, `sequelize`, `devDependencies`, `@supabase/supabase-js`, `@types/bcrypt`, `@types/jsonwebtoken`, `@types/node`, `winston`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `dependencies`, `@types/node`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `Banner`, `BannerEditorProps`, `EditModeContextValue` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0629800307219662 - nodes in this community are weakly interconnected._
- **Should `auth.routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06327683615819209 - nodes in this community are weakly interconnected._
- **Should `AdminContentManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._