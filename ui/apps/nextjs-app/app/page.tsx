import Link from 'next/link'
import { Button } from '@workspace/ui-core'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-base dark:bg-background">
      <main className="w-full max-w-4xl island-shell rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-8 rise-in">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold tracking-wide text-primary uppercase">
          🚀 Next.js 16 + Hono + Better Auth Monorepo
        </div>

        <h1 className="display-title text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Production-Ready Full-Stack Template
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Powered by Next.js 16 App Router, Hono.js API backend, Better Auth for authentication, Turborepo, and `@workspace/ui-core` shadcn design system.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6 text-left">
          <div className="feature-card p-5 rounded-xl border border-line flex flex-col gap-2">
            <div className="text-xl">⚡</div>
            <h3 className="font-bold text-base">Next.js 16 App Router</h3>
            <p className="text-xs text-muted-foreground">
              Modern server & client architecture, zero-config optimized rendering.
            </p>
          </div>
          <div className="feature-card p-5 rounded-xl border border-line flex flex-col gap-2">
            <div className="text-xl">🔥</div>
            <h3 className="font-bold text-base">Hono RPC Safety</h3>
            <p className="text-xs text-muted-foreground">
              100% end-to-end type safety direct from Hono route definitions.
            </p>
          </div>
          <div className="feature-card p-5 rounded-xl border border-line flex flex-col gap-2">
            <div className="text-xl">🛡️</div>
            <h3 className="font-bold text-base">Better Auth</h3>
            <p className="text-xs text-muted-foreground">
              Email/Password, social OAuth, password resets, and session management.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
