"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService, UserData } from "@/services/authService";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkRole: (role: string) => boolean;
  checkAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

// Rutas por rol (si no especifica, requiere autenticación pero cualquier rol)
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["Administrador", "SuperAdmin"],
  "/reports": ["Administrador", "Gerente", "Supervisor"],
  "/payroll": ["Administrador", "Contador"],
  "/employee-management": ["Administrador", "RRHH"],
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();

      if (isAuth && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Protección de rutas
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (isPublicRoute) return;

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar roles específicos para la ruta
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Buscar si la ruta actual tiene restricciones de rol
      for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname?.startsWith(route)) {
          const hasRequiredRole = allowedRoles.some((role) =>
            currentUser.roles.includes(role)
          );

          if (!hasRequiredRole) {
            router.push("/unauthorized");
            return;
          }
          break;
        }
      }
    }
  }, [pathname, isLoading, router]);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  };

  const checkRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const checkAnyRole = (roles: string[]): boolean => {
    return user?.roles.some((role) => roles.includes(role)) || false;
  };

  // Mostrar loader mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        checkRole,
        checkAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
