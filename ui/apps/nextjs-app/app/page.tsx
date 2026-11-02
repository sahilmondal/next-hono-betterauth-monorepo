import Link from "next/link";
import { Button } from "@workspace/ui-core";

export default function Home() {
  return (
    <div className="bg-base flex min-h-screen flex-col items-center justify-center p-6 dark:bg-background">
      <main className="island-shell rise-in flex w-full max-w-4xl flex-col items-center gap-8 rounded-2xl p-8 text-center md:p-12">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
          🚀 Next.js 16 + Hono + Better Auth Monorepo
        </div>

        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Production-Ready Full-Stack Template
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Powered by Next.js 16 App Router, Hono.js API backend, Better Auth for authentication,
          Turborepo, and `@workspace/ui-core` shadcn design system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="px-8 font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="px-8 font-semibold">
              Create Account
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="px-8 font-semibold">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid w-full grid-cols-1 gap-4 text-left md:grid-cols-3">
          <div className="feature-card border-line flex flex-col gap-2 rounded-xl border p-5">
            <div className="text-xl">⚡</div>
            <h3 className="text-base font-bold">Next.js 16 App Router</h3>
            <p className="text-xs text-muted-foreground">
              Modern server & client architecture, zero-config optimized rendering.
            </p>
          </div>
          <div className="feature-card border-line flex flex-col gap-2 rounded-xl border p-5">
            <div className="text-xl">🔥</div>
            <h3 className="text-base font-bold">Hono RPC Safety</h3>
            <p className="text-xs text-muted-foreground">
              100% end-to-end type safety direct from Hono route definitions.
            </p>
          </div>
          <div className="feature-card border-line flex flex-col gap-2 rounded-xl border p-5">
            <div className="text-xl">🛡️</div>
            <h3 className="text-base font-bold">Better Auth</h3>
            <p className="text-xs text-muted-foreground">
              Email/Password, social OAuth, password resets, and session management.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
