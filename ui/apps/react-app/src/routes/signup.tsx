import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/auth/signup-form'

export const Route = createFileRoute('/signup')({
  component: Signup,
})

function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-12 dark:bg-background">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
