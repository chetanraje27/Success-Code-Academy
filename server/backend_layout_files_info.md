# Backend Foundation — Complete File-by-File Summary

---

## Commit 1 + 2: TypeScript Config Fix + Environment Configuration

---

### [tsconfig.json](file:///d:/A/Success Code/success-code-academy/server/tsconfig.json) — MODIFIED

**Purpose:** Tells the TypeScript compiler how to process the server code.

| Setting | Value | What it does |
|---------|-------|-------------|
| `rootDir` | `./src` | Tells TypeScript all source code lives inside `src/` |
| `outDir` | `./dist` | Compiled JavaScript goes into `dist/` |
| `module` | `node16` | Generates module code compatible with Node.js 16+ |
| `moduleResolution` | `node16` | Resolves `import` paths using Node 16 rules |
| `target` | `ES2022` | Compiles to modern JavaScript (keeps async/await, etc.) |
| `lib` | `ES2022` | Makes ES2022 built-in types available (Array, Promise, etc.) |
| `types` | `["node"]` | Includes `@types/node` so `process`, `__dirname`, `Buffer`, etc. have types |
| `strict` | `true` | Enables all strict type-checking rules |
| `esModuleInterop` | `true` | Allows `import express from 'express'` syntax for CommonJS packages |
| `isolatedModules` | `true` | Ensures each file can be compiled independently |
| `skipLibCheck` | `true` | Skips type-checking `.d.ts` files from `node_modules` for faster builds |
| `resolveJsonModule` | `true` | Allows importing `.json` files |
| `include` | `src/**/*` | Only compiles files inside `src/` |
| `exclude` | `node_modules, dist` | Ignores dependencies and build output |

---

### [.env.example](file:///d:/A/Success Code/success-code-academy/server/.env.example) — NEW

**Purpose:** Template showing every environment variable the server needs. Developers copy this to `.env` and fill in real values.

| Variable | Default | What it controls |
|----------|---------|-----------------|
| `NODE_ENV` | `development` | Switches behavior (logging format, error detail, file transports) |
| `PORT` | `5000` | Which port the HTTP server listens on |
| `DB_HOST` | placeholder | Supabase PostgreSQL hostname |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `postgres` | Database name |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | placeholder | Database password |
| `JWT_SECRET` | placeholder | Secret key used to sign and verify JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | How long a JWT token stays valid |
| `CORS_ORIGIN` | `http://localhost:3000` | Which frontend origin is allowed to make API requests |
| `LOG_LEVEL` | `debug` | Minimum severity level for Winston to output |

---

### [src/config/environment.ts](file:///d:/A/Success Code/success-code-academy/server/src/config/environment.ts) — NEW

**Purpose:** Loads, validates, and exports all environment variables as a single typed object.

**Step-by-step:**

1. **`dotenv.config()`** — reads the `server/.env` file and injects variables into `process.env`
2. **`envSchema = z.object({...})`** — defines a Zod schema that declares:
   - Which variables are required (e.g., `DB_HOST` must be a non-empty string)
   - Which have defaults (e.g., `PORT` defaults to `"5000"`)
   - Type transformations (e.g., `PORT` string → number via `.transform()`)
   - Allowed values (e.g., `NODE_ENV` must be one of `development`, `production`, `test`)
3. **`envSchema.safeParse(process.env)`** — validates all of `process.env` against the schema
4. **If validation fails** → prints each invalid field with its error message, then calls `process.exit(1)` to stop the server immediately
5. **If validation passes** → exports `env` (the validated, typed config object)

**Exports:** `env` (the config object), `Env` (the TypeScript type)

---

### [src/types/environment.d.ts](file:///d:/A/Success Code/success-code-academy/server/src/types/environment.d.ts) — NEW

**Purpose:** Gives `process.env.X` autocomplete and type safety in the IDE.

**How it works:** Declares a `NodeJS.ProcessEnv` interface augmentation. TypeScript merges this with the existing `ProcessEnv` type, so when you type `process.env.DB_HOST`, the IDE knows it's a `string` and offers autocomplete.

> This file does NOT validate anything at runtime — that's `environment.ts`'s job. This file is purely for developer experience.

---

## Commit 3: Logger Setup

---

### [src/utils/logger.ts](file:///d:/A/Success Code/success-code-academy/server/src/utils/logger.ts) — NEW

**Purpose:** Creates and exports a Winston logger instance used by every file that needs to log.

**Step-by-step:**

1. **Imports `env`** from config — reads `LOG_LEVEL` and `NODE_ENV`
2. **Defines `devFormat`** — a custom format using `printf` that produces human-readable lines:
   ```
   2026-07-01 11:31:40 [info]: Server running on port 5000
   ```
3. **Creates `winston.createLogger()`** with:
   - `level: env.LOG_LEVEL` — only logs at this severity or above
   - `errorsFormat({ stack: true })` — captures stack traces from Error objects
   - `timestamp` — adds a timestamp to every log entry
4. **Console transport** — always active:
   - Development: colorized, human-readable format (`devFormat`)
   - Production: JSON format (machine-parseable for log aggregators)
5. **File transports** — production only:
   - `logs/error.log` — only `error` level, max 5 MB, keeps 5 rotated files
   - `logs/combined.log` — all levels, max 10 MB, keeps 5 rotated files
   - Creates the `logs/` directory if it doesn't exist
6. `exitOnError: false` — a logging failure doesn't crash the server

**Exports:** `logger` (default export)

---

## Commit 4: Error Handling Infrastructure

---

### [src/utils/AppError.ts](file:///d:/A/Success Code/success-code-academy/server/src/utils/AppError.ts) — NEW

**Purpose:** Custom error class that carries HTTP-specific metadata.

**Properties:**
| Property | Type | What it means |
|----------|------|--------------|
| `message` | `string` | Human-readable error description (inherited from `Error`) |
| `statusCode` | `number` | HTTP status code (e.g., `400`, `404`, `500`) |
| `status` | `string` | `"fail"` for 4xx errors, `"error"` for 5xx errors |
| `isOperational` | `boolean` | Always `true` — marks this as an expected error (not a bug) |

**How it's used:**
```typescript
throw new AppError('Course not found', 404);
// → { statusCode: 404, status: "fail", message: "Course not found" }
```

---

### [src/utils/asyncHandler.ts](file:///d:/A/Success Code/success-code-academy/server/src/utils/asyncHandler.ts) — NEW

**Purpose:** Wraps async route handlers so rejected promises are caught and forwarded to the error handler.

**How it works:**
1. Takes an async function `fn` as input
2. Returns a new function that calls `fn` and catches any rejection
3. If `fn` throws or rejects → the error is passed to `next(error)` which triggers the error handler middleware

**Why it exists:** Without this, an unhandled promise rejection inside a route handler would crash the server or hang the request. Express 5 handles this natively, but the wrapper makes the pattern explicit and self-documenting.

---

### [src/middlewares/errorHandler.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/errorHandler.ts) — NEW

**Purpose:** Global error-catching middleware. Every error in the app flows through here.

**Step-by-step:**

1. **Receives `err`** from `next(error)` calls or rejected promises
2. **Checks error type:**
   - **`AppError`** → uses its `statusCode`, `status`, and `message`
   - **Zod error** (detected by checking for an `issues` array) → returns `422` with field-level error details
   - **Unknown error** → returns generic `500 Internal Server Error`
3. **Logs the error** via Winston (includes URL, method, status code, stack trace)
4. **Sends JSON response:**
   ```json
   {
     "status": "fail",
     "statusCode": 404,
     "message": "Not Found",
     "errors": [],
     "stack": "..." // only in development
   }
   ```
5. **Dev vs Prod:** Stack trace is included in the response body during development, but hidden in production (only logged to the server)

**Design note:** Uses a structural `isZodError()` check instead of `instanceof ZodError` so it works across Zod v3 and v4 without import issues.

---

### [src/middlewares/notFound.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/notFound.ts) — NEW

**Purpose:** Catches any request that didn't match a defined route.

**How it works:**
1. Placed **after** all route definitions in the middleware stack
2. If a request reaches this middleware, no route handled it
3. Creates an `AppError` with a `404` status code and a message like `"Not Found — GET /nonexistent"`
4. Forwards it to `errorHandler` via `next(error)`

---

## Commit 5: Database Connection

---

### [src/config/database.ts](file:///d:/A/Success Code/success-code-academy/server/src/config/database.ts) — NEW

**Purpose:** Defines the Sequelize connection settings.

| Setting | Value | Why |
|---------|-------|-----|
| `host`, `port`, `database`, `username`, `password` | From `env` | Read from validated environment variables |
| `dialect` | `'postgres'` | Tells Sequelize to use PostgreSQL |
| `logging` | `console.log` in dev, `false` in prod | Shows raw SQL queries during development for debugging |
| `dialectOptions.ssl` | `{ require: true, rejectUnauthorized: false }` | Supabase requires SSL for all external connections |
| `pool.max` | `5` | Maximum 5 simultaneous database connections |
| `pool.min` | `0` | No minimum idle connections |
| `pool.acquire` | `30000` | Wait up to 30 seconds to acquire a connection before erroring |
| `pool.idle` | `10000` | Release idle connections after 10 seconds |

**Exports:** `dbConfig` (default export)

---

### [src/models/index.ts](file:///d:/A/Success Code/success-code-academy/server/src/models/index.ts) — NEW

**Purpose:** Creates the Sequelize instance and provides a connection health check.

**Step-by-step:**

1. **`new Sequelize(dbConfig)`** — creates the Sequelize instance using the config from `database.ts`
2. **`testConnection()`** — async function that:
   - Calls `sequelize.authenticate()` — sends `SELECT 1+1 AS result` to the database
   - If successful → logs "✅ Database connection established" and returns `true`
   - If it fails → logs "❌ Unable to connect" and returns `false`

**Exports:** `sequelize` (the instance), `testConnection()` (the health check)

> Future models (User, Course, etc.) will be registered on this instance.

---

### [.sequelizerc](file:///d:/A/Success Code/success-code-academy/server/.sequelizerc) — NEW

**Purpose:** Tells the Sequelize CLI (`npx sequelize-cli`) where to find things.

| Path | Points to | Why |
|------|-----------|-----|
| `config` | `sequelize.config.js` | Database credentials file for the CLI |
| `migrations-path` | `src/database/migrations/` | Where migration files live |
| `seeders-path` | `src/database/seeders/` | Where seeder files live |

This is a plain JS file because the CLI doesn't run TypeScript.

---

### [sequelize.config.js](file:///d:/A/Success Code/success-code-academy/server/sequelize.config.js) — NEW

**Purpose:** Database credentials file specifically for the Sequelize CLI.

**How it works:**
1. Calls `require('dotenv').config()` to load `.env`
2. Exports an object with three environments (`development`, `test`, `production`)
3. Each environment reads `DB_HOST`, `DB_PORT`, etc. from `process.env`
4. Includes the same SSL config as the app's `database.ts`

**Why separate from `database.ts`?** The CLI can't run TypeScript files. Both files read the same `.env` variables so they always stay in sync.

---

### `src/database/migrations/.gitkeep` and `src/database/seeders/.gitkeep` — NEW

**Purpose:** Empty placeholder files. Git doesn't track empty directories — these files ensure the `migrations/` and `seeders/` directories exist after a fresh `git clone`.

---

## Commit 6: Core Middleware Stack

---

### [src/config/cors.ts](file:///d:/A/Success Code/success-code-academy/server/src/config/cors.ts) — NEW

**Purpose:** Defines which origins, methods, and headers the server allows for cross-origin requests.

| Setting | Value | What it does |
|---------|-------|-------------|
| `origin` | `env.CORS_ORIGIN` | Only allows requests from your Next.js frontend URL |
| `methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | Allowed HTTP methods |
| `allowedHeaders` | `Content-Type, Authorization` | Headers the client can send |
| `credentials` | `true` | Allows cookies and `Authorization` headers in cross-origin requests |
| `maxAge` | `86400` (24 hours) | Browsers cache the preflight response for 24 hours to reduce OPTIONS requests |

**Exports:** `corsOptions` (default export)

---

### [src/middlewares/requestLogger.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/requestLogger.ts) — NEW

**Purpose:** Logs every HTTP request with method, URL, status code, response time, and client IP.

**How it works:**
1. Records `Date.now()` when the request arrives
2. Hooks into `res.on('finish')` — this event fires when the response has been fully sent
3. Calculates `duration = Date.now() - start`
4. Logs via Winston at the `http` level:
   ```
   GET /api/v1/health {"status":200,"duration":"110ms","ip":"::1"}
   ```

**Why `res.on('finish')`?** It captures the actual response status code, which isn't known until the route handler finishes.

---

### [src/middlewares/rateLimiter.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/rateLimiter.ts) — NEW

**Purpose:** Prevents abuse by limiting how many requests each IP can make.

**Exports two presets:**

| Export | Window | Max requests | Used for |
|--------|--------|-------------|----------|
| `defaultLimiter` | 15 minutes | 100 per IP | Applied globally to all routes |
| `submissionLimiter` | 15 minutes | 10 per IP | For form submissions (enquiry, contact, application) |

**How it works:**
- Uses `express-rate-limit` package
- Tracks requests per IP address in memory
- When limit is exceeded → returns `429 Too Many Requests` with a JSON error body
- `standardHeaders: true` → adds `RateLimit-*` headers to every response so clients know their remaining quota
- `legacyHeaders: false` → disables the older `X-RateLimit-*` headers

---

### [src/middlewares/validate.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/validate.ts) — NEW

**Purpose:** Factory function that creates a middleware to validate request data against a Zod schema.

**Parameters:**
| Param | Type | Default | What it does |
|-------|------|---------|-------------|
| `schema` | `z.ZodType` | required | The Zod schema to validate against |
| `target` | `'body' \| 'query' \| 'params'` | `'body'` | Which part of the request to validate |

**How it works:**
1. Calls `schema.safeParse(req[target])` — validates without throwing
2. **If invalid** → forwards `result.error` (a ZodError) to `next()`, which triggers the error handler to return a `422` response with field-level details
3. **If valid** → replaces `req[target]` with `result.data` (which includes any Zod defaults or transformations) and calls `next()`

**Usage example:**
```typescript
const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
router.post('/leads', validate(createLeadSchema), leadsController.create);
```

---

## Commit 7: Authentication Middleware

---

### [src/types/express.d.ts](file:///d:/A/Success Code/success-code-academy/server/src/types/express.d.ts) — NEW

**Purpose:** Adds a `user` property to Express's `Request` type so `req.user` doesn't cause TypeScript errors.

**Shape of `req.user`:**
| Field | Type | What it is |
|-------|------|-----------|
| `id` | `number` | The user's database ID |
| `role` | `string` | The user's role (e.g., `"super-admin"`, `"editor"`, `"admissions"`) |
| `email` | `string` | The user's email address |

The `?` (optional) means `req.user` is `undefined` until the `authenticate` middleware runs.

---

### [src/middlewares/authenticate.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/authenticate.ts) — NEW

**Purpose:** Verifies the JWT token from the request and identifies the caller.

**Step-by-step:**

1. **Read header** — looks for `Authorization: Bearer <token>`
2. **Missing or wrong format** → returns `401` with "Authentication required"
3. **Extract token** — splits on space, takes the second part
4. **Verify token** — calls `jwt.verify(token, env.JWT_SECRET)`:
   - If the token is expired → throws, caught → `401` "Invalid or expired token"
   - If the signature doesn't match → throws, caught → `401` "Invalid or expired token"
   - If valid → returns the decoded payload
5. **Attach to request** — sets `req.user = decoded` (with `id`, `role`, `email`)
6. **Call `next()`** — continues to the next middleware/route handler

**Does NOT:** Create tokens, handle login, or manage sessions. That's a business feature for later.

---

### [src/middlewares/authorize.ts](file:///d:/A/Success Code/success-code-academy/server/src/middlewares/authorize.ts) — NEW

**Purpose:** Checks if the authenticated user has the right role to access a route.

**How it works:**
1. **Factory function** — `authorize('super-admin', 'editor')` returns a middleware
2. **Checks `req.user`** — if missing, returns `401` (authenticate must run first)
3. **Checks role** — if `req.user.role` is NOT in the allowed list, returns `403` "You do not have permission"
4. **If allowed** → calls `next()`

**Usage example:**
```typescript
router.put('/news/:id',
  authenticate,                          // Step 1: who is this?
  authorize('super-admin', 'editor'),    // Step 2: are they allowed?
  newsController.update,                 // Step 3: do the work
);
```

---

## Commit 8: Routes, Controllers & App Assembly

---

### [src/controllers/health.controller.ts](file:///d:/A/Success Code/success-code-academy/server/src/controllers/health.controller.ts) — NEW

**Purpose:** Handles the health check request logic.

**What it returns:**
```json
{
  "status": "success",
  "data": {
    "server": "running",
    "uptime": 26.9,
    "timestamp": "2026-07-01T06:01:57.929Z",
    "database": "connected"
  }
}
```

**How it works:**
1. Calls `sequelize.authenticate()` — sends a quick query to the database
2. If it succeeds → `database: "connected"`, if it fails → `database: "disconnected"`
3. Returns the status, server uptime (seconds), current ISO timestamp, and DB status

**Why it imports `sequelize` directly instead of `testConnection()`:** The `testConnection()` function logs every time it runs. Health endpoints can be polled frequently, so using `sequelize.authenticate()` directly avoids log spam.

---

### [src/routes/v1/health.routes.ts](file:///d:/A/Success Code/success-code-academy/server/src/routes/v1/health.routes.ts) — NEW

**Purpose:** Defines the V1 health check route.

**What it does:** Maps `GET /` to the `getHealth` controller. When mounted inside the V1 router, this becomes `GET /api/v1/health`.

---

### [src/routes/v1/index.ts](file:///d:/A/Success Code/success-code-academy/server/src/routes/v1/index.ts) — NEW

**Purpose:** Groups all V1 routes into a single router.

**Currently mounts:**
| Path | Router | Resulting full path |
|------|--------|-------------------|
| `/health` | `healthRoutes` | `GET /api/v1/health` |

Future feature routes (`/courses`, `/leads`, `/auth`, `/news`, etc.) will be added as new lines here.

---

### [src/routes/index.ts](file:///d:/A/Success Code/success-code-academy/server/src/routes/index.ts) — NEW

**Purpose:** Top-level router that organizes versioned and unversioned routes.

**Mounts:**
| Path | Handler | Why |
|------|---------|-----|
| `GET /health` | `getHealth` controller directly | Unversioned health check for Render load balancer (it needs a simple `/health` URL) |
| `/api/v1/*` | `v1Router` | All versioned API routes |

---

### [src/app.ts](file:///d:/A/Success Code/success-code-academy/server/src/app.ts) — NEW

**Purpose:** Creates and configures the Express application. This is where the entire middleware stack is assembled.

**Middleware order (top to bottom):**

| # | Middleware | What it does |
|---|-----------|-------------|
| 1 | `helmet()` | Sets security-related HTTP headers (X-Content-Type-Options, Strict-Transport-Security, etc.) |
| 2 | `cors(corsOptions)` | Handles CORS preflight and response headers for the Next.js frontend |
| 3 | `express.json()` | Parses incoming JSON request bodies into `req.body` |
| 4 | `express.urlencoded({ extended: true })` | Parses URL-encoded form data (e.g., from HTML forms) into `req.body` |
| 5 | `requestLogger` | Logs every request's method, URL, status code, and response time |
| 6 | `defaultLimiter` | Rate limits all routes to 100 requests per 15 min per IP |
| 7 | `routes` | All defined routes (`/health`, `/api/v1/*`) |
| 8 | `notFound` | Catches unmatched requests → 404 error |
| 9 | `errorHandler` | Catches all errors → consistent JSON response |

**Order matters:**
- Security headers and CORS go first so every response gets them
- Body parsers go before routes so handlers can read `req.body`
- `notFound` goes after routes so it only catches truly unmatched requests
- `errorHandler` goes last so it catches errors from everything above

**Exports:** `app` (default export) — does NOT call `listen()`

---

### [src/index.ts](file:///d:/A/Success Code/success-code-academy/server/src/index.ts) — MODIFIED (was empty)

**Purpose:** The server entry point. This is what runs when you do `npm run dev` or `npm start`.

**Step-by-step:**

1. **`import { env }`** — triggers `environment.ts` which loads `.env` and validates all variables. If validation fails, the process exits here with clear error messages.
2. **`import app`** — triggers `app.ts` which builds the full Express app with all middleware.
3. **`await testConnection()`** — tests the database connection:
   - If connected → logs "✅ Database connection established"
   - If failed → logs "⚠️ Server starting without database connection" (doesn't block startup)
4. **`app.listen(env.PORT)`** — starts accepting HTTP connections on the configured port
5. **Logs** `"🚀 Server running on port 5000 [development]"`
6. **Registers shutdown handlers** for `SIGTERM` and `SIGINT` (Ctrl+C):
   - Logs which signal was received
   - Calls `server.close()` to stop accepting new connections
   - Waits for existing requests to finish
   - Exits with code `0` (clean exit)
   - If shutdown takes more than 10 seconds → forces exit with code `1`

**Why non-blocking DB check?** The server starts even if the database is down. This lets the `/health` endpoint report `"database": "disconnected"` instead of the server being completely unreachable.
