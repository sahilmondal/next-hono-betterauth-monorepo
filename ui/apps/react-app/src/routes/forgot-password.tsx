import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { authClient } from '@workspace/ui-clients'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await authClient.requestPasswordReset({
        email,
        redirectTo: window.location.origin + '/reset-password',
      })
      if (err) {
        setError(err.message || 'Failed to send reset email')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-12 dark:bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription>
              {success
                ? "If the email exists in our system, we've sent instructions."
                : 'Enter your email address to receive a password reset link.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="p-3 text-sm text-green-500 rounded bg-green-50/10 border border-green-500/20 text-center">
                  Check your inbox at <strong>{email}</strong> for reset
                  instructions.
                </div>
                <Button
                  onClick={() => navigate({ to: '/login' })}
                  className="w-full"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  {error && (
                    <div className="p-3 text-sm text-red-500 rounded bg-red-50/10 border border-red-500/20">
                      {error}
                    </div>
                  )}
                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Sending link...' : 'Send Reset Link'}
                    </Button>
                    <FieldDescription className="text-center">
                      Remember your password?{' '}
                      <a href="/login" className="underline">
                        Back to Login
                      </a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
