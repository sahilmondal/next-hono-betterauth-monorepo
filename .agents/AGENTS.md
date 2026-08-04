# Workspace Rules & Conventions

## File Naming Conventions

- Component filenames: **kebab-case** (e.g. `login-form.tsx`, `signup-form.tsx`)
- Component export functions: **PascalCase** (e.g. `export function LoginForm() {}`)
- Routing filenames: **kebab-case** (e.g. `forgot-password.tsx`, `reset-password.tsx`)
- Database schemas: **kebab-case.schema.ts** (e.g. `auth.schema.ts`)
- Configs & utilities: **kebab-case.ts** (e.g. `auth-client.ts`)

## Architecture Rules

- Use shared database package `@workspace/db` for backend services (Hono API, etc.).
- Avoid direct database connection initializations inside backend services; import `db` from `@workspace/db` instead.
- React App is a pure client-side SPA; it must not import `@workspace/db` or directly connect to the database.

## Full-Stack Type Safety Rules

- Always use Hono RPC for querying backend APIs in the frontend app instead of standard fetch or generated OpenAPI clients.
- The backend Hono app must chain all route definitions (e.g. `const routes = app.route("/users", usersRoute)...`) and export `AppType` from `api/http-api/src/main.ts`.
- Sub-app routers (e.g., `usersRoute`) must chain route definitions directly on definition (e.g. `const usersRoute = new Hono<HonoContext>().get(...)`) to preserve their types in the exported `AppType`.
- **Import Rules**: Do NOT use path aliases (`@/`) inside any files in `api/http-api/src` that are imported by or part of the `AppType` routes type chain (e.g., middleware, response utils, types, routes). Always use relative imports (e.g. `../config/logger`) to avoid typescript alias resolution errors in the frontend workspace.
- The RPC and Better Auth clients are located at `@workspace/ui-clients`. Import them as `import { api, authClient } from '@workspace/ui-clients'`.
