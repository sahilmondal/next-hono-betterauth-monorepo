"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "@workspace/ui-core";
import { authClient } from "@workspace/ui-clients";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Reset token is missing or invalid");
      setLoading(false);
      return;
    }

    try {
      const { error: err } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (err) {
        setError(err.message || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          {success
            ? "Your password has been successfully updated."
            : "Enter your new password below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="mt-2 flex flex-col gap-4">
            <div className="rounded border border-green-500/20 bg-green-50/10 p-3 text-center text-sm text-green-500">
              Password updated! You can now log in with your new credentials.
            </div>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        ) : !token ? (
          <div className="mt-2 flex flex-col gap-4">
            <div className="rounded border border-red-500/20 bg-red-50/10 p-3 text-center text-sm text-red-500">
              Invalid or expired password reset link. Please request a new link.
            </div>
            <Button
              onClick={() => router.push("/forgot-password")}
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
                <div className="rounded border border-red-500/20 bg-red-50/10 p-3 text-sm text-red-500">
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
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
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
                  {loading ? "Updating password..." : "Update Password"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
