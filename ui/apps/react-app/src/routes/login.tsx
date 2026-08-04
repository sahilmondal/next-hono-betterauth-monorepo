import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-12 dark:bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
