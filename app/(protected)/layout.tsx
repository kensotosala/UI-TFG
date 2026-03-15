"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthContext();
  const pathname = usePathname();

  const queryClient = new QueryClient();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="shrink-0">
              <Navbar />
            </div>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
              {children}
              <Toaster />
            </main>
          </div>
        </SidebarProvider>
      </QueryClientProvider>
    </div>
  );
}
