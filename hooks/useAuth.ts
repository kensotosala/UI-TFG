/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  authService,
  LoginCredentials,
  UserData,
} from "@/app/features/auth/services/authService";
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

  // Función de login con logs de depuración
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        console.log("Iniciando login...");
        setIsLoading(true);

        const response = await authService.login(credentials);
        console.log("Login exitoso, token recibido:", response.token);

        const userData = authService.decodeJWT(response.token);
        console.log("Usuario decodificado:", userData);

        if (userData) {
          setUser(userData);
          console.log("Usuario establecido en estado");
        }

        console.log("Redirigiendo a /");
        router.push("/");
        router.refresh();
      } catch (err: any) {
        console.error("Error en login:", err);
        throw err;
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

      console.log("Usuario desconectado, redirigiendo a /login");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Verificar autenticación
  const checkAuth = useCallback(() => authService.isAuthenticated(), []);

  // Verificar roles
  const hasRole = useCallback((role: string) => authService.hasRole(role), []);
  const hasAnyRole = useCallback(
    (roles: string[]) => authService.hasAnyRole(roles),
    []
  );

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
