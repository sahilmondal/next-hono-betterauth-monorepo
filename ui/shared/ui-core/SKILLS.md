---
title: UI Component Library - Skills & Architecture
version: 1.0.0
lastUpdated: 2026-05-18
toolsSupported: [copilot, claude-code, gemini, antigravity, opencode, codex]
tags: [ui-library, react, shadcn, tailwind, components]
---

# UI Component Library - Skills & Architecture

Reusable React component library built on shadcn/ui and Tailwind CSS. Provides form components, cards, buttons, and other UI elements used across all frontend applications.

**Location**: `packages/ui/`  
**Based On**: shadcn/ui (headless components)  
**Styling**: Tailwind CSS 4.1  
**Package Manager**: Bun

## Architecture Overview

**Purpose**: Centralized component library ensuring consistent styling and behavior across all applications.

**Components Are**:

- Unstyled / headless initially (from shadcn/ui)
- Styled with Tailwind utility classes
- Composable (can be combined into complex forms)
- TypeScript-first (full type safety)
- Re-exported from single index.ts

**Dependency Graph**:

```
nextjs-app
└── @workspace/ui-core
    ├── button.tsx
    ├── form.tsx
    ├── input.tsx
    ├── card.tsx
    └── ...
```

**No Component Logic**: Components are purely presentational. Business logic (auth, validation) lives in:

- `packages/auth-client` (API state, store)
- `apps/nextjs-app/features/` (feature components, hooks)

## Components

### Form Components

#### FormField, FormItem, FormLabel, FormControl, FormMessage

**Purpose**: react-hook-form integration layer. Provides context-aware field components.

```typescript
// From react-hook-form
import { Controller, useFormContext } from 'react-hook-form';

// Context for sharing field state
interface FieldContextValue {
  name: string;
  id: string;
  description?: string;
  invalid?: boolean;
  disabled?: boolean;
}

export const FormField = Controller;

export function FormItem({ children, className }: { children: React.ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

export function FormLabel({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
      {children}
    </label>
  );
}

export function FormControl({ children }: { children: React.ReactNode }) {
  const field = useFormField();
  return (
    <Slot
      ref={field.ref}
      id={field.id}
      disabled={field.disabled}
      aria-describedby={field.ariaDescribedBy}
      aria-invalid={field.invalid}
    >
      {children}
    </Slot>
  );
}

export function FormMessage({ children, className }: { children?: React.ReactNode; className?: string }) {
  const field = useFormField();
  const body = children || field.error?.message;

  if (!body) {
    return null;
  }

  return (
    <p className={cn("text-sm font-medium text-destructive", className)}>
      {body}
    </p>
  );
}
```

**Usage Pattern**:

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} type="email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Input

```typescript
import * as React from "react"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"
```

**Features**:

- `forwardRef` for parent access to DOM element
- Tailwind classes for styling (border, padding, focus ring, etc.)
- Disabled state styling
- `cn()` utility for conditional class merging

### Button

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

**Features**:

- `class-variance-authority` for variant management
- Multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: default, sm, lg, icon
- `asChild` prop for polymorphic component (render as different element)

### Card Components

```typescript
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}
```

**Usage**:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form fields here */}
  </CardContent>
  <CardFooter>
    {/* Footer content */}
  </CardFooter>
</Card>
```

### Label

```typescript
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName
```

Used by `FormLabel` but can be used standalone.

### Separator

```typescript
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName
```

Usage: `<Separator />` or `<Separator orientation="vertical" />`

## Styling Architecture

### Tailwind CSS Configuration

**File**: `postcss.config.mjs`

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**File**: Tailwind config (auto-generated from `components.json` via shadcn/cli)

**Key Tailwind Classes Used**:

- Colors: `text-primary`, `bg-secondary`, `text-destructive`, `text-muted-foreground`
- Spacing: `p-6`, `gap-2`, `mb-4`
- Layout: `flex`, `flex-col`, `items-center`, `justify-center`
- Sizing: `h-10`, `w-full`
- Borders: `rounded-md`, `border`, `border-input`
- Effects: `shadow-sm`, `opacity-50`
- Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes

### Color System

**Semantic Colors** (from shadcn/ui):

- `primary` — Main brand color
- `secondary` — Secondary brand color
- `destructive` — Error/danger (red)
- `muted-foreground` — Disabled, placeholder text
- `foreground` — Text
- `background` — Page background
- `card` — Card background
- `border` — Border color
- `input` — Input field background
- `ring` — Focus ring color

**Dark Mode**: Automatic via Tailwind's `dark:` prefix. Theme switching in `ThemeProvider` toggles `dark` class on `<html>`.

### Global Styles

**File**: `src/styles/globals.css`

```css
@import "tailwindcss";

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Includes**:

- Tailwind directives (`@import "tailwindcss"`)
- Base layer resets
- Dark mode colors
- CSS variables for theme

## Component Export Pattern

**File**: `src/index.ts`

```typescript
// Form
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./components/form";

// Input
export { Input } from "./components/input";

// Button
export { Button, buttonVariants } from "./components/button";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/card";

// Label
export { Label } from "./components/label";

// Separator
export { Separator } from "./components/separator";
```

**Usage in Apps**:

```typescript
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui-core";
```

## Component Patterns

### Composition Pattern

Components are designed to compose:

```typescript
// Build complex forms from basic components
<form>
  <Card>
    <CardHeader>
      <CardTitle>Login</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <FormField name="email" ... />
        <FormField name="password" ... />
        <Button type="submit">Sign In</Button>
      </div>
    </CardContent>
  </Card>
</form>
```

### Accessibility

All components follow WAI-ARIA patterns:

- Proper semantic HTML (`<form>`, `<button>`, `<input>`, `<label>`)
- ARIA attributes where needed (aria-describedby, aria-invalid)
- Focus management
- Keyboard navigation support
- Screen reader friendly

### Customization via Props

All components accept `className` prop for overrides:

```typescript
<Button variant="outline" size="sm" className="w-full">
  Custom Button
</Button>

<Card className="bg-red-50 border-red-200">
  Custom Card
</Card>
```

**Utility**: Use `cn()` helper for conditional class merging:

```typescript
import { cn } from "@workspace/ui-core/lib/utils"

<div className={cn("p-4", isActive && "bg-blue-50")}>
  Content
</div>
```

## Utilities

**File**: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose**: Merge Tailwind classes intelligently (twMerge resolves conflicts, clsx handles conditionals).

## Dependencies & Versions

**Production**:

- `react`: 19.2.4 (peer dependency)
- `react-dom`: 19.2.4 (peer dependency)
- `radix-ui/*`: Various headless UI libraries
  - `@radix-ui/react-slot`
  - `@radix-ui/react-label`
  - `@radix-ui/react-separator`
  - etc.
- `class-variance-authority`: For variant management
- `clsx`: Class merging utility
- `tailwind-merge`: Resolve Tailwind class conflicts

**DevDependencies**:

- `tailwindcss`: 4.1.18 (for Tailwind class IntelliSense in IDE)
- TypeScript, ESLint, Prettier

## Component Development Workflow

### Adding a New Component

1. **Install from shadcn/ui CLI** (if using shadcn component):

   ```bash
   cd packages/ui
   bunx shadcn-ui@latest add {component-name}
   ```

2. **Or create from scratch**:

   ```typescript
   // src/components/my-component.tsx
   import * as React from "react"
   import { cn } from "@/lib/utils"

   const MyComponent = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("p-4 bg-card rounded-md", className)}
       {...props}
     />
   ))
   MyComponent.displayName = "MyComponent"

   export { MyComponent }
   ```

3. **Export from index.ts**:

   ```typescript
   export { MyComponent } from "./components/my-component";
   ```

4. **Use in nextjs-app**:
   ```typescript
   import { MyComponent } from "@workspace/ui-core";
   ```

### Styling Guidelines

- Use Tailwind utility classes (no CSS-in-JS)
- Follow shadcn color naming (primary, secondary, destructive, muted-foreground)
- Respect `disabled` state styling
- Include dark mode support (automatic via Tailwind)
- Test on both light and dark backgrounds

### Testing Components

```typescript
// In nextjs-app or test file
import { Button, Card, CardHeader, CardTitle } from '@workspace/ui-core';

export function ComponentShowcase() {
  return (
    <div className="space-y-4 p-8">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button disabled>Disabled</Button>

      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
```

## File Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── (custom hooks for components)
│   ├── lib/
│   │   └── utils.ts                 # cn() utility
│   ├── styles/
│   │   └── globals.css              # Tailwind & base styles
│   └── index.ts                     # Main export
├── components.json                  # shadcn/ui config
├── postcss.config.mjs              # PostCSS + Tailwind setup
├── tsconfig.json
├── package.json
└── README.md
```

## When to Update This Skills File

Agents should update this file after:

- ✅ Adding new components to the library
- ✅ Modifying component API or props
- ✅ Changing styling approach or colors
- ✅ Adding new component patterns or utilities
- ✅ Updating dependencies (Tailwind version, Radix UI)
- ❌ NOT for: Small styling tweaks, bug fixes in component logic

---

## See Also

- [apps/nextjs-app/SKILLS.md](../../apps/nextjs-app/SKILLS.md) — Component usage in frontend
- [INTEGRATION-GUIDE.md](../../INTEGRATION-GUIDE.md) — UI patterns in auth flows
- [docs/AI_AGENT_UPDATES.md](../../docs/AI_AGENT_UPDATES.md) — How to update SKILLS

## Recently Added by AI Agents

(Updated by agents when making changes)

- **2026-05-18**: Initial comprehensive skills documentation created
