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

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Función para cargar usuario desde token
  const loadUserFromToken = useCallback(() => {
    const token = authService.getToken();
    if (token && authService.isAuthenticated()) {
      const userData = authService.decodeJWT(token);
      if (userData) {
        setUser(userData);
        return true;
      }
    }
    setUser(null);
    return false;
  }, []);

  // Inicialización al montar
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      loadUserFromToken();
      setIsLoading(false);
    };
    initializeAuth();
  }, [loadUserFromToken]);

  // Escuchar cambios en localStorage para sincronización entre pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      loadUserFromToken();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken]);

  // Protección de rutas
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (isPublicRoute) return;

    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, [pathname, isLoading, router]);

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      await authService.login(credentials);
      loadUserFromToken();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
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
