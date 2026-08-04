---
title: UI Components - Shared Component Library
version: 1.0.0
lastUpdated: 2026-05-24
toolsSupported: [copilot, claude-code]
tags: [react, components, tailwindcss, ui-library]
---

# UI Components Workspace

Reusable React/Next.js UI components built with Tailwind CSS, shadcn/ui foundations, and Radix UI primitives. This workspace provides a centralized library of accessible, composable components for use across all applications.

## Purpose

- 🎨 **Centralized UI Library**: Single source of truth for UI components
- ♿ **Accessibility**: Built on Radix UI for WCAG compliance
- 📦 **Composable**: Small, focused components that work together
- 🔄 **Reusability**: Share across all Next.js and React applications
- 🎯 **Type-Safe**: Full TypeScript support

## Workspace Structure

```
ui-components/
├── src/
│   ├── components/       # React components (Button, Input, Dialog, etc.)
│   ├── hooks/           # Custom React hooks (useMobile, etc.)
│   ├── styles/          # Global styles and Tailwind config
│   └── index.ts         # Main entry point
├── package.json         # Workspace dependencies
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
├── postcss.config.mjs   # PostCSS/Tailwind config
└── README.md            # Documentation
```

## Key Dependencies

### Component Libraries

- **@radix-ui/\***: Unstyled, accessible components
- **shadcn**: Pre-built component patterns
- **embla-carousel-react**: Carousel component
- **react-resizable-panels**: Resizable layout panels

### State Management

- **react-hook-form**: Form state and validation
- **@hookform/resolvers**: Form resolver adapters
- **zod**: Schema validation

### Utilities

- **class-variance-authority**: Component variants system
- **clsx**: Conditional className utility
- **tailwind-merge**: Intelligent Tailwind class merging
- **date-fns**: Date utilities

### UI

- **sonner**: Toast notifications
- **recharts**: Charting library
- **@hugeicons/react**: Icon library
- **vaul**: Drawer component
- **next-themes**: Theme provider

## Naming Conventions

- **Component files**: `ComponentName.tsx` (PascalCase)
- **Hook files**: `useHookName.ts` (camelCase with `use` prefix)
- **Type files**: `types.ts` or `ComponentName.types.ts`
- **Utility files**: `utility-name.ts` (kebab-case)

## Component Structure Example

```tsx
// src/components/Button.tsx
import { ComponentProps, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui-utils/helpers";

const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      outline: "...",
    },
  },
});

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  ),
);
```

## Usage in Applications

```tsx
// In Next.js app or React component
import { Button, Input, Dialog } from "@workspace/ui-components";
import { useFormState } from "react-hook-form";

export function LoginForm() {
  return (
    <Dialog>
      <form>
        <Input placeholder="Email" />
        <Button type="submit">Login</Button>
      </form>
    </Dialog>
  );
}
```

## Development Workflow

1. **Create components** in `src/components/`
2. **Add hooks** in `src/hooks/` if needed
3. **Export from** `src/components/index.ts`
4. **Test locally** in the Next.js app
5. **Document** in component files and README

## Building & Publishing

```bash
# Lint components
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

- Keep components focused on a single responsibility
- Export forwardRef for accessibility
- Use Tailwind CSS for styling
- Provide TypeScript types for all props
- Document complex components with JSDoc
- Support both controlled and uncontrolled modes
- Handle keyboard events and ARIA attributes

❌ **Don't**

- Add business logic to UI components
- Use inline styles
- Export unnamed components
- Mix styled-components or CSS modules
- Add external API calls
- Create component prop drilling beyond 2 levels

## Exports

Components are exported via named exports and tree-shakeable paths:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/components/*",
    "./hooks": "./src/hooks/index.ts",
    "./globals.css": "./src/styles/globals.css"
  }
}
```

## Related Workspaces

- **@workspace/ui-utils**: Utility functions and validators
- **@workspace/ui-core**: Foundation components (legacy)
- **@workspace/eslint-config**: Shared ESLint rules
- **@workspace/typescript-config**: Shared TypeScript configs
