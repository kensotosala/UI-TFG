import { AuthProvider } from "@/components/providers/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

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
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </AuthProvider>
  );
}
