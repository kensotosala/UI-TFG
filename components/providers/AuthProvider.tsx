"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  authService,
  UserData,
  LoginCredentials,
} from "@/app/features/auth/services/authService";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
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

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromToken = useCallback(() => {
    const token = authService.getToken();

    if (!token) {
      setUser(null);
      return false;
    }

    if (!authService.isAuthenticated()) {
      setUser(null);
      authService.logout();
      return false;
    }

    const userData = authService.decodeJWT(token);
    if (!userData) {
      setUser(null);
      authService.logout();
      return false;
    }

    setUser(userData);
    return true;
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      const hasValidAuth = loadUserFromToken();
      setIsLoading(false);

      if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
        router.replace("/login");
      }
    };

    initializeAuth();
  }, [loadUserFromToken, pathname, router]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === null) {
        const hasValidAuth = loadUserFromToken();

        if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken, pathname, router]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`),
    );

    const token = authService.getToken();
    const isValidAuth = token && authService.isAuthenticated();

    if (!isPublicRoute && !isValidAuth) {
      router.replace("/login");
      return;
    }

    if (pathname === "/login" && isValidAuth) {
      const userData = authService.decodeJWT(token!);
      const userRole = userData?.roles[0];

      if (userRole === "ADMIN") {
        router.replace("/admin");
      } else if (userRole === "EMPLEADO") {
        router.replace("/empleado");
      }
      return;
    }

    if (isValidAuth && user) {
      const userRole = user.roles[0];

      if (pathname?.startsWith("/admin") && userRole !== "ADMIN") {
        router.replace("/empleado");
        return;
      }

      if (pathname?.startsWith("/empleado") && userRole !== "EMPLEADO") {
        router.replace("/admin");
        return;
      }
    }
  }, [pathname, isLoading, router, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      await authService.login(credentials);
      const success = loadUserFromToken();

      if (success) {
        const userData = authService.decodeJWT(authService.getToken()!);
        const userRole = userData?.roles[0];

        if (userRole === "ADMIN") {
          router.replace("/admin");
        } else if (userRole === "EMPLEADO") {
          router.replace("/empleado");
        } else {
          router.replace("/");
        }
      } else {
        throw new Error("Error al cargar datos del usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    router.replace("/login");
    setIsLoading(false);
  };

  const checkRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const checkAnyRole = (roles: string[]): boolean => {
    return user?.roles.some((role) => roles.includes(role)) || false;
  };

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
        isAuthenticated: !!user && !!authService.getToken(),
        isLoading,
        login,
        logout,
        checkRole,
        checkAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
