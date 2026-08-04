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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { authClient } from '@workspace/ui-clients'

type ResetPasswordSearch = {
  token?: string
}

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => {
    return {
      token: (search.token as string) || undefined,
    }
  },
  component: ResetPassword,
})

function ResetPassword() {
  const { token } = Route.useSearch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Reset token is missing or invalid')
      setLoading(false)
      return
    }

    try {
      const { error: err } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (err) {
        setError(err.message || 'Failed to reset password')
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
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              {success
                ? 'Your password has been successfully updated.'
                : 'Enter your new password below.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="p-3 text-sm text-green-500 rounded bg-green-50/10 border border-green-500/20 text-center">
                  Password updated! You can now log in with your new
                  credentials.
                </div>
                <Button
                  onClick={() => navigate({ to: '/login' })}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            ) : !token ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="p-3 text-sm text-red-500 rounded bg-red-50/10 border border-red-500/20 text-center">
                  Invalid or expired password reset link. Please request a new
                  link.
                </div>
                <Button
                  onClick={() => navigate({ to: '/forgot-password' })}
                  className="w-full"
                  variant="outline"
                >
                  Request New Link
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
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Updating password...' : 'Update Password'}
                    </Button>
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
