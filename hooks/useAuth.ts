/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  // Ref para prevenir redirecciones durante el login
  const isLoginAttempt = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();

      if (isAuth && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        // Solo limpiar si no estamos en medio de un intento de login
        if (!isLoginAttempt.current && !isRedirecting.current) {
          authService.clearAuthData();
        }
      }

      setIsLoading(false);
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      // No reaccionar a cambios durante el login
      if (isLoginAttempt.current || isRedirecting.current) return;

      if (e.key === "auth_token" || e.key === "user_data") {
        initAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        console.log("Iniciando login...");

        // Marcar que estamos intentando login
        isLoginAttempt.current = true;
        setIsLoading(true);

        const response = await authService.login(credentials);
        console.log("Login exitoso, token recibido:", response.token);

        const userData = authService.decodeJWT(response.token);
        console.log("Usuario decodificado:", userData);

        if (userData) {
          setUser(userData);
          console.log("Usuario establecido en estado");
        }

        // Marcar que vamos a redirigir
        isRedirecting.current = true;

        // Pequeño delay para asegurar que todo esté listo
        setTimeout(() => {
          console.log("Redirigiendo a /");
          router.push("/");
          // Resetear refs después de la redirección
          setTimeout(() => {
            isLoginAttempt.current = false;
            isRedirecting.current = false;
          }, 500);
        }, 100);
      } catch (err: any) {
        console.error("Error en login:", err);
        // Resetear refs inmediatamente en caso de error
        isLoginAttempt.current = false;
        isRedirecting.current = false;
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);

      console.log("Usuario desconectado, redirigiendo a /login");
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const checkAuth = useCallback(() => authService.isAuthenticated(), []);

  const hasRole = useCallback((role: string) => authService.hasRole(role), []);
  const hasAnyRole = useCallback(
    (roles: string[]) => authService.hasAnyRole(roles),
    [],
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
