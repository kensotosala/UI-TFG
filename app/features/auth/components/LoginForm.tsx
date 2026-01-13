/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Usar el contexto en lugar del hook
  const { login, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/");
      router.refresh();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });

      // Guardar en localStorage si "Recuérdame" está activado
      if (rememberMe) {
        localStorage.setItem("remembered_user", username);
      } else {
        localStorage.removeItem("remembered_user");
      }

      // Forzar recarga completa para refrescar contexto
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar usuario recordado
  useEffect(() => {
    const rememberedUser = localStorage.getItem("remembered_user");
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
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
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {error}
                  </AlertDescription>
                </Alert>
              )}

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
                    disabled={isLoading}
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
                      disabled={isLoading}
                      className="h-11 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
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
                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Recordarme
                  </Label>
                </div> */}

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
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
                  className="text-blue-600 hover:underline font-medium"
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
