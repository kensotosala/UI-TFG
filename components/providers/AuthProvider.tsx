"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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

const getRouteForRole = (roles: string[]): string => {
  if (roles.includes("ADMINISTRADOR")) return "/admin";
  if (roles.includes("SUPERVISOR")) return "/admin";
  if (roles.includes("RECURSOS HUMANOS")) return "/admin";
  if (roles.includes("DESARROLLADOR")) return "/admin";
  if (roles.includes("EMPLEADO")) return "/empleado";

  return "/empleado";
};

const canAccessRoute = (userRoles: string[], pathname: string): boolean => {
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) return true;

  if (pathname.startsWith("/admin")) {
    return userRoles.some((role) =>
      ["ADMIN", "SUPERVISOR", "RECURSOS HUMANOS", "DESARROLLADOR"].includes(
        role,
      ),
    );
  }

  if (pathname.startsWith("/empleado")) {
    return userRoles.includes("EMPLEADO");
  }

  return true;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Refs para controlar redirecciones
  const isLoginInProgress = useRef(false);
  const isRedirecting = useRef(false);

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
      if (isLoginInProgress.current || isRedirecting.current) return;

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
    // No ejecutar redirecciones durante el proceso de login
    if (isLoading || isLoginInProgress.current || isRedirecting.current) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`),
    );

    const token = authService.getToken();
    const isValidAuth = token && authService.isAuthenticated();

    if (!isPublicRoute && !isValidAuth) {
      router.replace("/login");
      return;
    }

    if (pathname === "/login" && isValidAuth && !isRedirecting.current) {
      const userData = authService.decodeJWT(token!);
      if (userData?.roles && userData.roles.length > 0) {
        const targetRoute = getRouteForRole(userData.roles);
        isRedirecting.current = true;
        router.replace(targetRoute);
        setTimeout(() => {
          isRedirecting.current = false;
        }, 500);
      }
      return;
    }

    if (isValidAuth && user && user.roles.length > 0) {
      const hasAccess = canAccessRoute(user.roles, pathname || "");

      if (!hasAccess) {
        console.log("❌ Acceso denegado a:", pathname, "Roles:", user.roles);
        const targetRoute = getRouteForRole(user.roles);
        isRedirecting.current = true;
        router.replace(targetRoute);
        setTimeout(() => {
          isRedirecting.current = false;
        }, 500);
        return;
      }
    }
  }, [pathname, isLoading, router, user]);

  const login = async (credentials: LoginCredentials) => {
    // Marcar que el login está en progreso
    isLoginInProgress.current = true;
    isRedirecting.current = false;

    try {
      await authService.login(credentials);
      const success = loadUserFromToken();

      if (success) {
        const userData = authService.decodeJWT(authService.getToken()!);

        if (userData?.roles && userData.roles.length > 0) {
          const targetRoute = getRouteForRole(userData.roles);
          isRedirecting.current = true;
          router.replace(targetRoute);
          setTimeout(() => {
            isRedirecting.current = false;
          }, 500);
        } else {
          isRedirecting.current = true;
          router.replace("/empleado");
          setTimeout(() => {
            isRedirecting.current = false;
          }, 500);
        }
      } else {
        throw new Error("Error al cargar datos del usuario después del login");
      }
    } catch (error) {
      // En caso de error, aseguramos que no haya redirección
      isRedirecting.current = false;
      throw error;
    } finally {
      // Pequeño delay antes de permitir nuevos efectos
      setTimeout(() => {
        isLoginInProgress.current = false;
      }, 300);
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
