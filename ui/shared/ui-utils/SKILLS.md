---
title: UI Utils - Utility Functions & Validators
version: 1.0.0
lastUpdated: 2026-05-24
toolsSupported: [copilot, claude-code]
tags: [utilities, validators, helpers, zod]
---

# UI Utils Workspace

Pure utility functions, Zod-based validators, and constants for UI and business logic across the monorepo. This workspace contains reusable, framework-agnostic code that supports both frontend and backend.

## Purpose

- 🔧 **Utility Functions**: Reusable helpers for common tasks
- 🔍 **Validators**: Zod schemas for runtime data validation
- 📝 **Constants**: Centralized constants and enums
- 🧪 **Pure Functions**: No external dependencies (except zod)
- 📦 **Tree-Shakeable**: Granular imports for smaller bundles

## Workspace Structure

```
ui-utils/
├── src/
│   ├── helpers/         # Utility functions (cn, format, etc.)
│   ├── validators/      # Zod schemas (userSchema, etc.)
│   ├── constants/       # App constants and enums
│   └── index.ts         # Main entry point
├── package.json         # Workspace dependencies
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
└── README.md            # Documentation
```

## Key Dependencies

### Validation

- **zod**: TypeScript-first schema validation

### Utilities

- **clsx**: Conditional className utility
- **tailwind-merge**: Intelligent Tailwind class merging

## Available Categories

### 1. Helpers (`src/helpers/index.ts`)

```tsx
// Common utility functions
export function cn(...classes: ClassValue[]): string;
export function formatDate(date: Date, format?: string): string;
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T;
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T;
export function classNames(...classes: any[]): string;
```

### 2. Validators (`src/validators/index.ts`)

```tsx
// Zod schemas for validation
import { z } from "zod";

export const emailSchema = z.string().email("Invalid email");
export const passwordSchema = z.string().min(8, "Password too short");

export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
```

### 3. Constants (`src/constants/index.ts`)

```tsx
// Application constants
export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
} as const;
```

## Usage Examples

### Using Helpers

```tsx
import { cn, formatDate } from "@workspace/ui-utils/helpers";

// Conditional className
const buttonClass = cn(
  "px-4 py-2 rounded",
  variant === "primary" && "bg-blue-500",
  disabled && "opacity-50 cursor-not-allowed",
);

// Format dates
const formatted = formatDate(new Date(), "MMM dd, yyyy");
```

### Using Validators

```tsx
import { userSchema } from "@workspace/ui-utils/validators";

// In API endpoint
export async function createUser(data: unknown) {
  const user = userSchema.parse(data);
  // user is now typed as { email, password, name }
  return db.user.create(user);
}

// In React form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignupForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(userSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        // data is validated automatically
        await createUser(data);
      })}
    >
      {/* form fields */}
    </form>
  );
}
```

### Using Constants

```tsx
import { HTTP_CODES, ROUTES } from "@workspace/ui-utils/constants";

// In API routes
if (response.status === HTTP_CODES.OK) {
  // ...
}

// In navigation
router.push(ROUTES.DASHBOARD);

// In Link components
<Link href={ROUTES.LOGIN}>Login</Link>;
```

## Naming Conventions

- **Helper files**: `helper-name.ts` (kebab-case)
- **Validator files**: `schema-name.ts` or just use `index.ts`
- **Constant files**: `constant-name.ts` or just use `index.ts`
- **Exports**: Named exports only (no default exports)

## File Examples

### Helper Function Example

```tsx
// src/helpers/cn.ts
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type ClassValue = string | undefined | null | false;

/**
 * Merge classnames with intelligent Tailwind class deduplication
 * @param classes - Classes to merge
 * @returns Merged class string
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
```

### Validator Example

```tsx
// src/validators/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Constant Example

```tsx
// src/constants/api.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    PROFILE: "/users/profile",
    SETTINGS: "/users/settings",
  },
} as const;

export const CACHE_KEYS = {
  USER: "user",
  POSTS: "posts",
  COMMENTS: "comments",
} as const;
```

## Development Workflow

1. **Add helpers** in `src/helpers/` for utility functions
2. **Add validators** in `src/validators/` for Zod schemas
3. **Add constants** in `src/constants/` for app constants
4. **Export from index** in each subdirectory
5. **Test locally** in consuming workspaces
6. **Document** complex functions with JSDoc

## Building & Publishing

```bash
# Lint utilities
bun run lint

# Format code
bun run format

# Type check
bun run typecheck

# Build for distribution
bun build
```

## Best Practices

✅ **Do**

- Keep functions pure (no side effects)
- Use TypeScript for full type safety
- Document complex functions with JSDoc
- Export via index files for tree-shaking
- Use zod for all data validation
- Create constants for magic strings/numbers
- Write reusable, testable code

❌ **Don't**

- Import React or framework-specific code
- Use async/await without good reason
- Export default exports
- Create circular dependencies
- Add external API calls
- Mix business logic with utilities

## Exports

Utilities are exported via granular paths for optimal tree-shaking:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./helpers": "./src/helpers/index.ts",
    "./validators": "./src/validators/index.ts",
    "./constants": "./src/constants/index.ts"
  }
}
```

## Related Workspaces

- **@workspace/ui-components**: React components using these utilities
- **@workspace/auth-client**: API client using these validators
- **@workspace/eslint-config**: Shared ESLint rules
- **@workspace/typescript-config**: Shared TypeScript configs
