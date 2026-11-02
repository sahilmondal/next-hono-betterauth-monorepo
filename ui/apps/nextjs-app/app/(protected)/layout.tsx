import type { Metadata } from "next";
import { ProtectedLayoutClient } from "@/components/layout/protected-layout-client";

export const metadata: Metadata = {
  title: "Dashboard - Monorepo",
  description: "User dashboard",
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
