import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication pages',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-8 bg-base dark:bg-background">
      <div className="w-full max-w-md rise-in">{children}</div>
    </div>
  )
}
