/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref para controlar si ya mostramos un toast
  const toastShownRef = useRef(false);

  const { login, isLoading: authLoading, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Resetear el ref al inicio de cada intento
    toastShownRef.current = false;

    try {
      if (rememberMe) {
        localStorage.setItem("remembered_user", username);
      } else {
        localStorage.removeItem("remembered_user");
      }

      console.log("📝 Intentando login para:", username);

      await login({ username, password });

      console.log("✅ Login completado exitosamente");

      // No mostramos toast en éxito porque redirige inmediatamente
    } catch (err: any) {
      console.error("❌ Error en login:", err);

      // ✅ LIMPIAR AMBOS CAMPOS: usuario y contraseña
      setUsername("");
      setPassword("");

      const errorMessage = err?.message || "";
      const statusCode = err?.response?.status || err?.status;
      const responseData = err?.response?.data;

      let toastMessage = "";

      if (statusCode === 401) {
        toastMessage =
          "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente.";
      } else if (statusCode === 403) {
        toastMessage =
          "Acceso denegado. Su cuenta podría estar inactiva, bloqueada o sin permisos suficientes. Contacte al administrador.";
      } else if (statusCode === 404) {
        toastMessage =
          "Usuario no encontrado. Verifique que su nombre de usuario sea correcto.";
      } else if (statusCode === 429) {
        toastMessage =
          "Demasiados intentos de inicio de sesión. Por favor, espere unos minutos antes de intentar nuevamente.";
      } else if (
        statusCode === 500 ||
        statusCode === 502 ||
        statusCode === 503
      ) {
        toastMessage =
          "Error del servidor. El sistema está experimentando problemas. Por favor, intente más tarde.";
      } else if (statusCode === 0 || !statusCode) {
        if (
          errorMessage.toLowerCase().includes("network") ||
          errorMessage.toLowerCase().includes("fetch") ||
          errorMessage.toLowerCase().includes("failed to fetch") ||
          err.name === "NetworkError" ||
          err.name === "TypeError"
        ) {
          toastMessage =
            "Error de conexión. Verifique su conexión a internet e intente nuevamente.";
        } else {
          toastMessage =
            "No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.";
        }
      } else if (
        errorMessage.toLowerCase().includes("unauthorized") ||
        errorMessage.toLowerCase().includes("invalid credentials") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("credenciales incorrectas") ||
        errorMessage.toLowerCase().includes("usuario o contraseña") ||
        errorMessage.toLowerCase().includes("invalid username or password")
      ) {
        toastMessage =
          "Credenciales incorrectas. Por favor, verifique su usuario y contraseña.";
      } else if (
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("fetch") ||
        errorMessage.toLowerCase().includes("conexión")
      ) {
        toastMessage =
          "Error de conexión. Verifique su conexión a internet e intente nuevamente.";
      } else if (
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("time out")
      ) {
        toastMessage =
          "El servidor tardó demasiado en responder. Por favor, intente nuevamente.";
      } else if (
        errorMessage.toLowerCase().includes("bloqueado") ||
        errorMessage.toLowerCase().includes("locked") ||
        errorMessage.toLowerCase().includes("blocked") ||
        errorMessage.toLowerCase().includes("suspended")
      ) {
        toastMessage =
          "Su cuenta ha sido bloqueada por seguridad. Contacte al administrador del sistema.";
      } else if (
        errorMessage.toLowerCase().includes("not found") &&
        !statusCode
      ) {
        toastMessage =
          "No se pudo conectar con el servidor. Verifique que el sistema esté disponible.";
      } else if (responseData?.message) {
        toastMessage = responseData.message;
      } else if (errorMessage) {
        toastMessage = errorMessage;
      } else {
        toastMessage =
          "Error al iniciar sesión. Por favor, verifique sus credenciales e intente nuevamente.";
      }

      // Guardar el mensaje para mostrarlo después de que el estado se actualice
      setTimeout(() => {
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            toastId: "login-error-" + Date.now(), // ID único para cada error
          });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const rememberedUser = localStorage.getItem("remembered_user");
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  // Efecto para manejar errores de autenticación globales
  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      if (event.detail?.message && !toastShownRef.current) {
        toastShownRef.current = true;
        toast.error(event.detail.message, {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          toastId: "auth-error-" + Date.now(),
        });
      }
    };

    window.addEventListener("auth-error" as any, handleAuthError);

    return () => {
      window.removeEventListener("auth-error" as any, handleAuthError);
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de RRHH
          </h1>
          <p className="text-gray-600">Inicie sesión para acceder al sistema</p>
        </div>

        <Card className="shadow-2xl border border-gray-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingrese sus credenciales para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="username"
                    className="flex items-center gap-2 mb-2"
                  >
                    <Mail className="h-4 w-4 text-gray-500" />
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 mb-2"
                  >
                    <Lock className="h-4 w-4 text-gray-500" />
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isSubmitting}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t pt-6">
            <div className="text-center text-sm text-gray-600">
              <p>¿Problemas para iniciar sesión?</p>
              <p className="mt-1">
                Contacte al{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:underline font-medium transition-colors"
                >
                  Departamento de Sistemas
                </Link>
              </p>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>
                © {new Date().getFullYear()} Sistema RRHH - Todos los derechos
                reservados
              </p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
