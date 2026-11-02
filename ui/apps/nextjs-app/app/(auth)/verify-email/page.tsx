"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui-core";
import { authClient } from "@workspace/ui-clients";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function doVerification() {
      if (!token) {
        if (active) {
          setStatus("error");
          setError("Verification token is missing.");
        }
        return;
      }

      try {
        const { error: err } = await authClient.verifyEmail({
          query: { token },
        });

        if (!active) return;

        if (err) {
          setStatus("error");
          setError(err.message || "Verification failed. The token may be expired or invalid.");
        } else {
          setStatus("success");
        }
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setError("An unexpected error occurred. Please try again.");
        console.error(err);
      }
    }

    doVerification();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-xl">Email Verification</CardTitle>
        <CardDescription>
          {status === "loading" && "Verifying your email address..."}
          {status === "success" && "Email verified successfully!"}
          {status === "error" && "Verification failed."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {status === "loading" && (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        )}

        {status === "success" && (
          <div className="flex w-full flex-col gap-4">
            <div className="rounded border border-green-500/20 bg-green-50/10 p-3 text-center text-sm text-green-500">
              Your email has been verified. You can now login.
            </div>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex w-full flex-col gap-4">
            <div className="rounded border border-red-500/20 bg-red-50/10 p-3 text-center text-sm text-red-500">
              {error}
            </div>
            <Button onClick={() => router.push("/signup")} className="w-full" variant="outline">
              Back to Registration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
