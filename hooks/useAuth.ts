/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  authService,
  LoginCredentials,
  UserData,
} from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

interface UseAuthReturn {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Inicializar autenticación
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();

      if (isAuth && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        authService.clearAuthData();
      }

      setIsLoading(false);
    };

    initAuth();

    // Escuchar cambios en localStorage (para múltiples pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user_data") {
        initAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Función de login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setIsLoading(true);
        const response = await authService.login(credentials);

        // Obtener datos del usuario desde el token
        const userData = authService.decodeJWT(response.token);
        if (userData) {
          setUser(userData);
        }

        // Redirigir a la página principal
        router.push("/");
        router.refresh(); // Forzar recarga de la página
      } catch (error: any) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Función de logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);

      // Redirigir a login
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Verificar autenticación
  const checkAuth = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  // Verificar roles
  const hasRole = useCallback((role: string) => {
    return authService.hasRole(role);
  }, []);

  const hasAnyRole = useCallback((roles: string[]) => {
    return authService.hasAnyRole(roles);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
  };
};
