# @workspace/ui-clients

This shared package contains the configured connection clients for backend services. It is reused by frontend applications within the monorepo workspace.

## Clients

### 1. Hono RPC API Client (`api`)

Provides 100% type safety for REST API endpoints utilizing Hono's RPC feature.

#### Usage

```typescript
import { api } from '@workspace/ui-clients'

// Fully typed query:
const res = await api.users.me.$get()
if (res.ok) {
  const data = await res.json()
  console.log('User Profile:', data.user)
}
```

### 2. Better Auth Client (`authClient`)

Configured Better Auth client instance for managing session state, logins, and logouts.

#### Usage

```typescript
import { authClient } from '@workspace/ui-clients'

// Check session:
const { data: session, isPending } = authClient.useSession()

// Sign out:
await authClient.signOut()
```

---

## Configuration

Both clients use `import.meta.env.VITE_API_URL` as the base endpoint URL, falling back to `http://localhost:3007` (standard local development port for `http-api`).
