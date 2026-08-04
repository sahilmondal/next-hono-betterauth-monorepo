import { db } from "@workspace/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`\n========================================`);
      console.log(`[Better-Auth Reset Password] Link for ${user.email}:`);
      console.log(url);
      console.log(`========================================\n`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`\n========================================`);
      console.log(`[Better-Auth Email Verification] Link for ${user.email}:`);
      console.log(url);
      console.log(`========================================\n`);
    },
  },
  socialProviders: {
    github: {
      enabled: process.env.ENABLE_GITHUB_OAUTH === "true",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      enabled: process.env.ENABLE_GOOGLE_OAUTH === "true",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
