# UI Utils

Utility functions, validators, and constants for UI and business logic across the application.

## Features

- ✅ Pure utility functions (no dependencies on React)
- 🔒 Zod-based validators
- 📝 Constants and enums
- 🧪 Fully typed with TypeScript
- 📦 Tree-shakeable exports

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
├── helpers/        # Utility functions
├── validators/     # Zod schemas and validation
├── constants/      # Application constants
└── index.ts        # Main entry point
```

## Usage

### Helpers

```tsx
import { formatDate, cn } from "@workspace/ui-utils/helpers";

const formatted = formatDate(new Date());
const classNames = cn("text-sm", condition && "text-bold");
```

### Validators

```tsx
import { userSchema } from "@workspace/ui-utils/validators";

const validation = userSchema.parse(data);
```

### Constants

```tsx
import { HTTP_CODES, ROUTES } from "@workspace/ui-utils/constants";

console.log(HTTP_CODES.OK); // 200
```

## Contributing

- Keep utilities simple and pure
- Document complex logic
- Use TypeScript for type safety
- Export via index files for tree-shaking
- No React dependencies

## Dependencies

- clsx - Conditional className utility
- tailwind-merge - Merge Tailwind classes intelligently
- zod - Schema validation
