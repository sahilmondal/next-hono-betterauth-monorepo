import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { authClient } from '@workspace/ui-clients'

type VerifyEmailSearch = {
  token?: string
}

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => {
    return {
      token: (search.token as string) || undefined,
    }
  },
  component: VerifyEmail,
})

function VerifyEmail() {
  const { token } = Route.useSearch()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function doVerification() {
      if (!token) {
        if (active) {
          setStatus('error')
          setError('Verification token is missing.')
        }
        return
      }

      try {
        const { error: err } = await authClient.verifyEmail({
          query: { token },
        })

        if (!active) return

        if (err) {
          setStatus('error')
          setError(
            err.message ||
              'Verification failed. The token may be expired or invalid.',
          )
        } else {
          setStatus('success')
        }
      } catch (err) {
        if (!active) return
        setStatus('error')
        setError('An unexpected error occurred. Please try again.')
        console.error(err)
      }
    }

    doVerification()

    return () => {
      active = false
    }
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-12 dark:bg-background">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-xl">Email Verification</CardTitle>
            <CardDescription>
              {status === 'loading' && 'Verifying your email address...'}
              {status === 'success' && 'Email verified successfully!'}
              {status === 'error' && 'Verification failed.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {status === 'loading' && (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}

            {status === 'success' && (
              <div className="flex flex-col gap-4 w-full">
                <div className="p-3 text-sm text-green-500 rounded bg-green-50/10 border border-green-500/20 text-center">
                  Your email has been verified. You can now login.
                </div>
                <Button
                  onClick={() => navigate({ to: '/login' })}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col gap-4 w-full">
                <div className="p-3 text-sm text-red-500 rounded bg-red-50/10 border border-red-500/20 text-center">
                  {error}
                </div>
                <Button
                  onClick={() => navigate({ to: '/signup' })}
                  className="w-full"
                  variant="outline"
                >
                  Back to Registration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
