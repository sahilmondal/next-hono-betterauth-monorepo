"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@workspace/ui-clients";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Separator,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@workspace/ui-core";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

export function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="bg-base flex min-h-screen items-center justify-center dark:bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="text-sm font-medium text-muted-foreground">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="border-line flex h-16 shrink-0 items-center gap-2 border-b bg-card/50 px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-base flex min-h-[calc(100vh-4rem)] flex-1 flex-col gap-4 p-4 md:p-6 dark:bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
