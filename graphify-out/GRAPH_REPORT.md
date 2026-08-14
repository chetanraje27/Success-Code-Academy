# Graph Report - Success-Code-Academy  (2026-08-14)

## Corpus Check
- Large corpus: 460 files · ~3,712,739 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 922 nodes · 1663 edges · 90 communities (78 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 56
- Community 57
- Community 58
- Community 59
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 74

## God Nodes (most connected - your core abstractions)
1. `adminApiFetch()` - 47 edges
2. `compilerOptions` - 20 edges
3. `useEditModeOptional()` - 19 edges
4. `EditableText()` - 16 edges
5. `compilerOptions` - 16 edges
6. `AdminModal()` - 15 edges
7. `useEditMode()` - 15 edges
8. `AdminContentManager()` - 12 edges
9. `isAdminRole()` - 12 edges
10. `recordMediaRevision()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdminSettingsPage()` --calls--> `adminApiFetch()`  [EXTRACTED]
  client/src/app/admin/settings/page.tsx → client/src/lib/admin-api.ts
- `ContactClient()` --calls--> `useSiteSettings()`  [EXTRACTED]
  client/src/app/(main)/contact/ContactClient.tsx → client/src/lib/site-settings.ts
- `generateMetadata()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CourseDetailPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/[id]/page.tsx → client/src/lib/api.ts
- `CoursesPage()` --calls--> `getApiBase()`  [EXTRACTED]
  client/src/app/(main)/courses/page.tsx → client/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (90 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (58): ADMIN, ADMIN_ROLES, AdminRole, isAdminRole(), SUPER_ADMIN, authenticate, ADMIN_ROLE_SET, authorize() (+50 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (39): AuthPurpose, changeAdminPassword, checkMobileOrLogin, createToken(), getCurrentUser, loginAdmin, publicAdmin(), publicUser() (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (31): main(), app, corsOptions, dbConfig, appBaseUrl(), Env, envSchema, parsed (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (41): bcrypt, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken, multer (+33 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (39): ADMIN_PUBLIC_ATTRIBUTES, createAcademyVideo, createBanner, createContactMessage, createCourse, createCourseForm, createNewsArticle, createNotification (+31 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (25): Course, CoursesClient(), classroomFeatures, CourseDetailClient(), CourseDetailClientProps, courseVisuals, timeSlots, CourseDetailPage() (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (37): dependencies, framer-motion, lucide-react, next, react, react-dom, react-icons, devDependencies (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (29): dist, ES2022, node, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+21 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (21): AdminDashboardPage(), DashboardStats, quickActions, RecentStudent, TokenState, AdminSettingsPage(), initialSettings, SiteSettings (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (26): nodemon, author, description, devDependencies, nodemon, sequelize-cli, ts-node, @types/multer (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (20): AdministratorEditorModal(), generatePassword(), ResetLink, AdminAdministratorsPage(), AdminLayout(), AdminTheme, navigation, routeNames (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (11): AdminNotificationsPage(), ICON_PRESETS, renderNotificationIcon(), AdminContentColumn, AdminContentField, AdminContentManager(), FieldValue, initialValues() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (13): AdminCoursesPage(), ContactMessageEditorModal(), AdminContactMessagesPage(), CourseFormEditorModal(), AdminCourseFormsPage(), AdminScholarshipFormsPage(), ScholarshipFormEditorModal(), AdminStudentsPage() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (16): Course, courseStyles, ExploreCourses(), Announcement, HomeBanner, HomeClient(), PublicContentResponse, renderAnnouncementIcon() (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (15): metadata, EditModeContext, EditModeContextValue, EditModeProvider(), useEditMode(), LeadsDrawer(), SettingsEditor(), CookieConsent() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (11): AdmissionsClient(), metadata, ParentsTrustUs(), learningPath, proofPoints, WhySCA(), EditableText(), EditableTextProps (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (14): AdminModal(), Banner, BannerEditor(), BannerEditorProps, Result, ACTION_LABELS, MediaResourceType, Revision (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (11): categoryConfig, GalleryPage(), VideoItem, videoItems, AcademyInsights(), BlogItem, VideoItem, InstagramEmbed() (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (9): Header(), HeaderUser, Button(), ButtonProps, ProfileModal(), ProfileModalProps, SignInModal(), SignInModalProps (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (11): ContentMap, ContentOverride, ContentScope, fetchContentMap(), LiveContentContext, LiveContentContextValue, LiveContentProvider(), pathnameToPageKey() (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (10): restoreMediaRevision, initMediaRevision(), MediaResourceType, MediaRevision, MediaRevisionAction, MediaRevisionAttributes, MediaRevisionCreationAttributes, restoreValues() (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.35
Nodes (10): AdminLoginPage(), backendUrl(), DELETE(), GET(), isSameOrigin(), parseBackendResponse(), POST(), PUT() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (7): Course, initCourse(), sequelize, initUser(), User, UserAttributes, UserCreationAttributes

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): Course, courses, NavLink, NewsItem, newsItems, overviewFeatures, Statistic, statistics (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (11): deleteAcademyVideo, deleteBanner, deleteNewsArticle, deleteResult, deleteStarStudent, recordMediaRevision(), updateAcademyVideo, updateBanner (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.24
Nodes (9): backendBase(), DELETE, forward(), GET, HandlerContext, isSameOrigin(), PATCH, POST (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.32
Nodes (5): ContactClient(), generateCaptcha(), INITIAL_CAPTCHA, Op, metadata

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (8): assertAdminIdentityIsFree(), assertNotLastSuperAdmin(), countSuperAdmins(), createAdminAccount, deleteAdminAccount, getAdminAccounts, publicAdminAccount(), updateAdminAccount

### Community 29 - "Community 29"
Cohesion: 0.39
Nodes (8): getContactMessages, getCourseForms, getCourses, getListOptions(), getScholarshipForms, getUsers, searchLeads, sendPaginated()

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (5): page, pendingRequests, result, socket, width

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (3): directoryMap, fs, path

### Community 32 - "Community 32"
Cohesion: 0.60
Nodes (5): backendBase(), GET(), POST(), proxy(), PUT()

### Community 33 - "Community 33"
Cohesion: 0.40
Nodes (3): inter, metadata, StyledJsxRegistry()

### Community 34 - "Community 34"
Cohesion: 0.40
Nodes (5): ContentBlock, ContentBlockAttributes, ContentBlockCreationAttributes, ContentBlockKind, initContentBlock()

### Community 35 - "Community 35"
Cohesion: 0.60
Nodes (4): backendUrl(), GET(), latestContent, staleContentResponse()

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (4): AcademyVideo, AcademyVideoAttributes, AcademyVideoCreationAttributes, initAcademyVideo()

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (4): AdminPasswordReset, AdminPasswordResetAttributes, AdminPasswordResetCreationAttributes, initAdminPasswordReset()

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (4): Banner, BannerAttributes, BannerCreationAttributes, initBanner()

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (4): ContactMessage, ContactMessageAttributes, ContactMessageCreationAttributes, initContactMessage()

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (4): CourseRegistration, CourseRegistrationAttributes, CourseRegistrationCreationAttributes, initCourseRegistration()

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (4): initNewsArticle(), NewsArticle, NewsArticleAttributes, NewsArticleCreationAttributes

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (4): initNotification(), Notification, NotificationAttributes, NotificationCreationAttributes

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): initOtpVerification(), OtpVerification, OtpVerificationAttributes, OtpVerificationCreationAttributes

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): initScholarshipRegistration(), ScholarshipRegistration, ScholarshipRegistrationAttributes, ScholarshipRegistrationCreationAttributes

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (4): initSiteSetting(), SiteSetting, SiteSettingAttributes, SiteSettingCreationAttributes

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (4): initStarStudent(), StarStudent, StarStudentAttributes, StarStudentCreationAttributes

### Community 47 - "Community 47"
Cohesion: 0.50
Nodes (4): initTopperResult(), TopperResult, TopperResultAttributes, TopperResultCreationAttributes

### Community 48 - "Community 48"
Cohesion: 0.60
Nodes (3): isTransientDatabaseError(), readFromDatabase(), TRANSIENT_DATABASE_ERRORS

### Community 49 - "Community 49"
Cohesion: 0.40
Nodes (4): data, https, options, req

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (4): getSignedUploadUrl, getSupabase(), upload, uploadImage

### Community 58 - "Community 58"
Cohesion: 0.67
Nodes (3): createUser, publicStudent(), updateUser

### Community 59 - "Community 59"
Cohesion: 0.67
Nodes (3): getSettings, loadSettingsMap(), updateSettings

## Knowledge Gaps
- **303 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+298 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `adminApiFetch()` connect `Community 13` to `Community 5`, `Community 9`, `Community 11`, `Community 12`, `Community 15`, `Community 17`, `Community 20`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `EditableText()` connect `Community 16` to `Community 5`, `Community 14`, `Community 15`, `Community 18`, `Community 20`, `Community 27`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `isAdminRole()` connect `Community 22` to `Community 11`, `Community 5`, `Community 15`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _303 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05834464043419267 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07137254901960784 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08599033816425121 - nodes in this community are weakly interconnected._