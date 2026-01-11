import { AppSidebar } from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar fijo arriba */}
            <div className="shrink-0">
              <Navbar />
            </div>

            {/* Contenido scrollable */}
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </AuthProvider>
  );
}
