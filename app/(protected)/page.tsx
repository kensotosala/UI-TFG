"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.roles[0];

      if (userRole === "ADMIN") {
        router.replace("/admin");
      } else if (userRole === "EMPLEADO") {
        router.replace("/empleado");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}
