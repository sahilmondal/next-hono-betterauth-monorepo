# UI Components

Reusable React/Next.js UI components built with Tailwind CSS and shadcn/ui foundations.

## Features

- ✅ Built with React 19 & Next.js 16
- 🎨 Styled with Tailwind CSS 4.1
- ♿ Accessible components with Radix UI primitives
- 📦 Tree-shakeable exports
- 🔧 Full TypeScript support
- 🎯 Zero external dependencies (except React)

## Installation

```bash
bun install
```

## Development

```bash
bun dev
```

## Building

```bash
bun build
```

## Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── styles/         # Global styles
└── index.ts        # Main entry point
```

## Usage

```tsx
import { Button, Input, Dialog } from "@workspace/ui-components";

export function MyComponent() {
  return (
    <Dialog>
      <Button>Click me</Button>
    </Dialog>
  );
}
```

## Contributing

- Components should be functional (hooks-based)
- Use Tailwind CSS for styling
- Keep components simple and focused
- Add proper TypeScript types
- Test accessibility

## Dependencies

- @hookform/resolvers - Form resolvers
- react-hook-form - Form state management
- recharts - Charting library
- zod - Schema validation
- date-fns - Date utilities
- class-variance-authority - Component variants
