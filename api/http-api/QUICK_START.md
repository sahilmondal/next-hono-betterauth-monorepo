# 🚀 Hono.js Production API - Quick Start Guide

Welcome! Your **Hono.js API** is integrated with the monorepo workspace, PostgreSQL, Drizzle ORM, and Better Auth.

---

## 📋 What Was Created

A **fully-featured backend architecture** with:

- ✅ **Domain-driven routing** (users, health checks)
- ✅ **Database layer** powered by the shared `@workspace/db` package
- ✅ **Secure authentication** powered by Better Auth server instance
- ✅ **Middleware stack** (Better Auth session attach, rate limiting, compress, cors, error handler, logger)
- ✅ **Type-safe RPC API** chained for compile-time frontend client resolution
- ✅ **Structured logging** with Pino

---

## 🎯 Next Steps (5 minutes to running)

### 1. **Set Up PostgreSQL Database**

Make sure PostgreSQL is running locally or accessible remotely.

```bash
# Create database
createdb hono_api
```

### 2. **Configure Environment Variables**

```bash
# Copy example file
cp .env.example .env

# Edit .env with your PostgreSQL connection and Better Auth secret
nano .env
```

Required changes:

- `DATABASE_URL` → Your PostgreSQL connection string
- `BETTER_AUTH_SECRET` → Min 32 characters (run: `bunx --bun @better-auth/cli secret`)
- `BETTER_AUTH_URL` → The base URL of your frontend application (`http://localhost:3000`)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hono_api
BETTER_AUTH_SECRET=your-generated-32-char-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### 3. **Initialize Database & Run Migrations**

Database migrations are managed centrally inside the `@workspace/db` package (located in `packages/db`).

```bash
# Generate migrations based on schemas
bun --filter @workspace/db db:generate

# Apply migrations to database
bun --filter @workspace/db db:migrate
```

### 4. **Start Development Server**

```bash
# Start development server from root (starts all monorepo apps)
bun dev

# Or start the API in isolation
bun --filter hono-api dev
```

Server runs on `http://localhost:3007` with hot-reloading!

---

## ✅ Verify Setup Works

### Test Health Endpoint

```bash
curl http://localhost:3007/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-07-02T21:00:00.000Z"
}
```

---

## 📁 Project Structure Overview

```
api/http-api/
├── dist/                # Production build output
├── src/
│   ├── config/          # Configurations
│   │   ├── env.ts       # Type-safe environment validation
│   │   └── logger.ts    # Pino logger setup
│   ├── lib/
│   │   └── auth.ts      # Better Auth server configuration
│   ├── middleware/      # Hono middleware
│   │   ├── error-handler.ts
│   │   ├── logger.ts
│   │   └── rate-limit.ts
│   ├── modules/         # Domain-driven feature modules
│   │   └── users/
│   │       ├── users.controller.ts
│   │       ├── users.route.ts
│   │       └── users.service.ts
│   ├── types/           # Type definitions
│   ├── utils/           # Utility helpers
│   └── main.ts          # App initialization & Hono RPC export
├── tsconfig.json        # TypeScript configuration
└── package.json         # Package scripts & dependencies
```

---

## 🔌 API Endpoints Reference

### Authentication Endpoints (Better Auth)

Authentications are automatically caught and handled at `/auth/*` by Better Auth handler:

| Endpoint              | Method | Description                               |
| --------------------- | ------ | ----------------------------------------- |
| `/auth/sign-up-email` | POST   | Sign up a new user using email & password |
| `/auth/sign-in-email` | POST   | Sign in an existing user                  |
| `/auth/sign-out`      | POST   | Clear the session & sign out              |

### User Endpoints (Chained RPC)

| Endpoint    | Method | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `/users/me` | GET    | Returns the authenticated user session context |

---

## 📚 Available Commands

Run these commands inside the `api/http-api` workspace:

```bash
bun run dev              # Start with hot-reload
bun run build            # Build for production (output to dist/main.js)
bun run typecheck        # TypeScript validation
bun run lint             # Lint the codebase
```

---

## 🚀 Production Deployment Checklist

- [ ] Update `BETTER_AUTH_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use production PostgreSQL database
- [ ] Enable HTTPS on your host environment
- [ ] Ensure frontend `BETTER_AUTH_URL` and backend environment variables match
- [ ] Run database migrations prior to deploying the server

Happy building! 🎉
