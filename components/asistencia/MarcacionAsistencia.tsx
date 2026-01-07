"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAsistencia } from "@/hooks/useAsistencia";
import {
  Clock,
  CheckCircle,
  LogIn,
  LogOut,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface MarcacionAsistenciaProps {
  empleadoId: number;
  nombreEmpleado?: string;
  departamento?: string;
}

export const MarcacionAsistencia: React.FC<MarcacionAsistenciaProps> = ({
  empleadoId,
  nombreEmpleado = "Empleado",
  departamento = "Departamento",
}) => {
  const { toast } = useToast();
  const [horaLocal, setHoraLocal] = useState<string>("");
  const [fechaActual, setFechaActual] = useState<string>("");

  const { marcarAsistencia, cargarEstado, isLoading, estado, horaServer } =
    useAsistencia({
      empleadoId,
      onSuccess: (message) => {
        toast({
          title: "✅ Asistencia registrada",
          description: message,
          duration: 5000,
        });
      },
      onError: (error) => {
        toast({
          title: "❌ Error",
          description: error,
          variant: "destructive",
          duration: 5000,
        });
      },
    });

  // Actualizar hora local y fecha
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHoraLocal(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setFechaActual(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
  }, [cargarEstado]);

  const getEstadoInfo = () => {
    if (!estado)
      return {
        texto: "Cargando...",
        color: "default",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
      };

    switch (estado.estado) {
      case "PENDIENTE":
        return {
          texto: "Pendiente de entrada",
          color: "yellow",
          icon: <Clock className="h-4 w-4" />,
        };
      case "PRESENTE":
        return {
          texto: "Presente (pendiente salida)",
          color: "green",
          icon: <LogIn className="h-4 w-4" />,
        };
      case "COMPLETO":
        return {
          texto: "Jornada completada",
          color: "blue",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      default:
        return {
          texto: estado.estado,
          color: "default",
          icon: <AlertCircle className="h-4 w-4" />,
        };
    }
  };

  const getBotonTexto = () => {
    if (!estado) return "Cargando...";

    if (estado.estado === "PENDIENTE") return "Marcar Entrada";
    if (estado.estado === "PRESENTE") return "Marcar Salida";
    return "Jornada Completada";
  };

  const getBotonIcono = () => {
    if (!estado) return <Loader2 className="h-4 w-4 animate-spin" />;

    if (estado.estado === "PENDIENTE")
      return <LogIn className="h-4 w-4 mr-2" />;
    if (estado.estado === "PRESENTE")
      return <LogOut className="h-4 w-4 mr-2" />;
    return <CheckCircle className="h-4 w-4 mr-2" />;
  };

  const estaDeshabilitado = estado?.estado === "COMPLETO";

  const estadoInfo = getEstadoInfo();

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Control de Asistencia
            </CardTitle>
            <CardDescription>
              Sistema de registro de jornada laboral
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {estadoInfo.icon}
            <span>{estadoInfo.texto}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Información del empleado */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Empleado:</span>
            <span className="text-sm font-semibold">{nombreEmpleado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Departamento:
            </span>
            <span className="text-sm">{departamento}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">ID:</span>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {empleadoId}
            </span>
          </div>
        </div>

        <Separator />

        {/* Información de fecha y hora */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Fecha actual</div>
            <div className="text-lg font-semibold">{fechaActual}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Hora local
              </div>
              <div className="text-2xl font-bold text-center font-mono">
                {horaLocal}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Hora servidor
              </div>
              <div className="text-2xl font-bold text-center font-mono">
                {horaServer || "--:--:--"}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Registros de asistencia */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Registro del día</h3>

          {estado ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-green-600" />
                  <span>Hora de entrada:</span>
                </div>
                <span className="font-mono font-semibold">
                  {estado.horaEntrada || "--:--"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5 text-blue-600" />
                  <span>Hora de salida:</span>
                </div>
                <span className="font-mono font-semibold">
                  {estado.horaSalida || "--:--"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </div>

        <Separator />

        {/* Botón de acción */}
        <div className="pt-2">
          <Button
            onClick={marcarAsistencia}
            disabled={isLoading || estaDeshabilitado}
            className={`w-full py-6 text-lg ${
              estado?.estado === "PRESENTE"
                ? "bg-blue-600 hover:bg-blue-700"
                : estado?.estado === "COMPLETO"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {getBotonIcono()}
                {getBotonTexto()}
              </>
            )}
          </Button>

          {estaDeshabilitado && (
            <p className="text-center text-sm text-gray-500 mt-2">
              ✅ Tu jornada laboral de hoy ya ha sido completada
            </p>
          )}

          {estado?.estado === "PRESENTE" && (
            <p className="text-center text-sm text-blue-600 mt-2">
              ⏰ Recuerda marcar tu salida al finalizar tu jornada
            </p>
          )}
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-400 text-center space-y-1">
          <p>• El registro se realiza en tiempo real con el servidor</p>
          <p>• La hora del servidor es la oficial para el registro</p>
          <p>• Contacta con RRHH ante cualquier incidencia</p>
        </div>
      </CardContent>
    </Card>
  );
};
