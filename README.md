# 🚀 React + Hono.js + Better Auth Monorepo Template

Welcome to the **React + Hono.js + Better Auth Monorepo Template**! This is a production-ready, highly-optimized, and full-stack monorepo designed for speed, developer experience, and end-to-end type safety.

Orchestrated using **Turborepo** and powered by **Bun**, this template brings together a blazing-fast **Hono.js** API, a modern **React 19 SPA** using **TanStack Router**, secure authentication via **Better Auth**, and type-safe database queries via **Drizzle ORM**.

---

## 🛠️ Tech Stack & Core Technologies

| Layer                 | Technologies Used                             | Description                                                                                        |
| :-------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Frontend UI**       | **React 19**, **Vite 8**, **Tailwind CSS v4** | A highly interactive UI layer styled with the next-generation Tailwind engine.                     |
| **Frontend Routing**  | **TanStack Router**                           | File-based routing with 100% type safety and automatic route code-generation.                      |
| **Backend API**       | **Hono.js**                                   | Light, edge-ready, and ultra-fast web framework running on port `3007`.                            |
| **Authentication**    | **Better Auth**                               | Client & Server SDKs for secure email/password auth, verification, reset flows, and social logins. |
| **Database & ORM**    | **Drizzle ORM**, **PostgreSQL**               | Type-safe SQL queries, schemas, and live migration toolkit.                                        |
| **Client Type Safety**| **Hono RPC**                                  | Achieves end-to-end type safety directly from backend routes without code generation.              |
| **Orchestration**     | **Turborepo**, **Bun**                        | Monorepo task pipeline management, execution caching, and fast package installation.               |

---

## 📐 Workspace Architecture

```mermaid
graph TD
  subgraph ui ["UI & Frontend"]
    react-tanstack-template["React Application (TanStack Router)"]
    ui-components["@workspace/ui-components (Shared shadcn)"]
    ui-clients["@workspace/ui-clients (Shared Hono RPC & Auth Clients)"]
  end

  subgraph api ["Backend API"]
    http-api["Hono API (http-api)"]
    worker-api["Worker API (worker-api)"]
  end

  subgraph packages ["Shared Packages"]
    db["@workspace/db (Drizzle ORM & Postgres)"]
  end

  react-tanstack-template -.-> db
  http-api --> db
  ui-clients -->|RPC & Auth Calls| http-api
  react-tanstack-template -->|Imports Clients| ui-clients
```

### 📁 Project Structure

```
.
├── api/
│   ├── http-api/           # Hono.js API server (runs on port 3007)
│   └── worker-api/         # Hono.js Worker application
├── packages/
│   ├── db/                 # Shared database package with Drizzle schemas & connections
│   ├── eslint-config/      # Global ESLint rules
│   └── typescript-config/  # Shared TypeScript configurations
├── ui/
│   ├── apps/
│   │   └── react-app/      # Vite + React 19 Client SPA with TanStack Router (port 3000)
│   └── shared/
│       ├── ui-clients/     # Shared type-safe API & Better Auth clients
│       ├── ui-components/  # Shared UI components (Radix, Base UI, Lucide)
│       ├── ui-core/        # Shared core styling & configs
│       └── ui-utils/       # Shared UI utility helpers
├── package.json            # Root workspace configuration
└── turbo.json              # Turborepo task pipeline config
```

---

## 🚀 Getting Started

Follow these steps to get the development environment running on your machine:

### 📋 Prerequisites

- **Bun**: Make sure [Bun](https://bun.sh) is installed (`>= 1.1`).
- **PostgreSQL**: Ensure you have a running PostgreSQL database.

---

### 1. Installation

Install dependencies across the monorepo from the root directory:

```bash
bun install
```

---

### 2. Configure Environment Variables

You need to copy the environment configuration templates and fill in your details:

#### For the Backend API (`api/http-api/`)

Copy `.env.example` to `.env`:

```bash
cp api/http-api/.env.example api/http-api/.env
```

Configure the following values inside `api/http-api/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hono_api
BETTER_AUTH_SECRET=your_generated_better_auth_secret  # Run: bunx --bun @better-auth/cli secret
BETTER_AUTH_URL=http://localhost:3000                 # URL of your frontend application
```

#### For the Frontend Client (`ui/apps/react-app/`)

Copy `.env.local` configuration:

```bash
cp ui/apps/react-app/.env.local ui/apps/react-app/.env
```

Configure `BETTER_AUTH_SECRET` to match the backend's secret:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_generated_better_auth_secret
```

---

### 3. Database Migration

Generate and apply the database migrations using Drizzle ORM:

```bash
# Generate Drizzle migration files based on schemas
bun --filter hono-api db:generate

# Apply migrations directly to PostgreSQL
bun --filter hono-api db:migrate
```

---

### 4. Run Development Servers

Start both the frontend Vite development server and Hono.js API server concurrently:

```bash
bun dev
```

- **Frontend App** will run at `http://localhost:3000`
- **Hono.js Backend** will run at `http://localhost:3007`

---

## 🔑 Authentication Flows

This template handles complete client-server authentication flows powered by **Better Auth**:

1. **User Sign Up**:
   - The user fills out the form at `/signup`.
   - Frontend calls `authClient.signUp.email(...)`.
   - Backend processes the registration, writes the user to the DB, and prints the confirmation link in the console (for dev testing).
2. **Email Verification**:
   - Clicking the verification link redirects the user to `/verify-email?token=...` on the frontend, completing verification.
3. **Login**:
   - The user inputs credentials at `/login`.
   - Frontend performs `authClient.signIn.email(...)` to create a session on the Hono.js server.
4. **Password Reset**:
   - Requesting a reset at `/forgot-password` sends a link (printed to the console in dev).
   - User navigates to `/reset-password?token=...` to set a secure password.

---

## 🔗 Full-Stack Type Safety with Hono RPC

This monorepo template achieves 100% end-to-end type safety directly from the Hono.js router definitions using **Hono RPC**.

1. **Route Chaining & AppType Export**:
   Backend routes are chained and exported in `api/http-api/src/main.ts`:
   ```typescript
   const routes = app
     .get("/health", ...)
     .route("/users", usersRoute);
   export type AppType = typeof routes;
   ```
2. **Path Alias Type Compatibility**:
   Imports inside `api/http-api` referenced by the exported `AppType` are structured as relative paths so they resolve natively inside consumer workspaces (like the React app) without any configuration mappings.
3. **Type-Safe RPC Client**:
   The shared package `@workspace/ui-clients` (`ui/shared/ui-clients/`) imports the `AppType` and initializes the client using Hono's `hc` inside `src/api-client.ts`:
   ```typescript
   import { hc } from 'hono/client'
   import type { AppType } from 'hono-api'
   export const api = hc<AppType>(import.meta.env.VITE_API_URL || 'http://localhost:3007')
   ```
   Consumer apps (like `react-app`) import the client directly:
   ```typescript
   import { api } from '@workspace/ui-clients'
   ```
4. **Autocomplete & Compile-Time Check**:
   Using `api` ensures complete autocomplete on request URL paths, HTTP query params, json request bodies, headers, and type safety on the return response schemas (e.g. `api.users.me.$get()`).

---

## 📐 Project Conventions & Guidelines

To maintain code cleanliness, the repository enforces the following conventions:

- **File Names**:
  - Components: **kebab-case** (e.g. `login-form.tsx`, `signup-form.tsx`)
  - Routes (TanStack Router): **kebab-case** matching URL structure (e.g. `forgot-password.tsx`)
  - DB Schemas: **kebab-case.schema.ts** (e.g. `auth.schema.ts`)
  - Configs & Utils: **kebab-case.ts** (e.g. `auth-client.ts`)
- **React Components**: Always export components as **PascalCase** named exports:
  ```typescript
  export function SignupForm() {
    return <div>...</div>
  }
  ```
- **Architecture Rules**:
  - The React app is a client-only SPA. Do not import database schemas or connect to Postgres directly from the frontend workspace.
  - The Hono.js API backend serves as the gateway to the Postgres DB via the shared `@workspace/db` package.

---

## 📚 Scripts Reference

| Command                                | Target   | Description                                                |
| :------------------------------------- | :------- | :--------------------------------------------------------- |
| `bun dev`                              | Root     | Starts all apps in development mode concurrently.          |
| `bun build`                            | Root     | Compiles all workspaces for production.                    |
| `bun lint`                             | Root     | Runs ESLint analysis across the repository.                |
| `bun format`                           | Root     | Formats the codebase using Prettier.                       |
| `bun check-types`                      | Root     | Validates TypeScript types across the monorepo.            |
| `bun --filter @workspace/db db:studio` | Database | Opens Drizzle Studio to explore database records visually. |

---

## License

This repository template is licensed under the MIT License. Feel free to customize and use it for your personal or commercial applications!
