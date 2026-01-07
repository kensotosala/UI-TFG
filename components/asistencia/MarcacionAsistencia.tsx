"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Clock, Calendar } from "lucide-react";
import { useMarcacion } from "@/hooks/useMarcacion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MarcacionAsistenciaProps {
  empleadoId: number;
}

export const MarcacionAsistencia: React.FC<MarcacionAsistenciaProps> = ({
  empleadoId,
}) => {
  const { marcarAsistencia, loading, error, data } = useMarcacion();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMarcar = async () => {
    if (!empleadoId || empleadoId <= 0) {
      alert("ID de empleado inválido");
      return;
    }

    const result = await marcarAsistencia(empleadoId);

    if (result.success) {
      setShowSuccess(true);
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      // El error ya está manejado en el hook y mostrado en la UI
    }
  };

  // Determinar el estado visual basado en la respuesta
  const getEstadoVisual = () => {
    if (!data?.data) return null;

    const estado = data.data.estado?.toUpperCase();

    if (
      estado === "COMPLETO" ||
      (data.data.horaEntrada && data.data.horaSalida)
    ) {
      return {
        texto: "Asistencia Completa",
        variant: "success" as const,
        icon: <CheckCircle2 className="h-5 w-5" />,
      };
    } else if (estado === "PRESENTE" || data.data.horaEntrada) {
      return {
        texto: "Entrada Registrada",
        variant: "default" as const,
        icon: <Clock className="h-5 w-5" />,
      };
    } else if (estado === "PENDIENTE") {
      return {
        texto: "Pendiente",
        variant: "secondary" as const,
        icon: <Clock className="h-5 w-5" />,
      };
    }

    return null;
  };

  const estadoVisual = getEstadoVisual();
  const horaActual = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Marcación de Asistencia</CardTitle>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        <CardDescription>
          Marca tu entrada o salida para el día de hoy
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información de estado */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium">Estado:</span>
            {estadoVisual ? (
              <Badge className="gap-1">
                {estadoVisual.icon}
                {estadoVisual.texto}
              </Badge>
            ) : (
              <Badge variant="outline">Sin registro</Badge>
            )}
          </div>
          <div className="text-sm text-gray-600">{horaActual}</div>
        </div>

        {/* Información de horarios */}
        {data?.data && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {data.data.horaEntrada && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-700 font-medium">Entrada</div>
                <div className="text-lg font-semibold">
                  {new Date(data.data.horaEntrada).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
            {data.data.horaSalida && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-700 font-medium">Salida</div>
                <div className="text-lg font-semibold">
                  {new Date(data.data.horaSalida).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Botón de acción */}
        <Button
          onClick={handleMarcar}
          disabled={loading}
          size="lg"
          className="w-full"
          variant={
            data?.data?.horaEntrada && !data.data.horaSalida
              ? "default"
              : "outline"
          }
        >
          {loading ? (
            <>
              <span className="mr-2">Procesando...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            </>
          ) : data?.data?.horaEntrada && !data.data.horaSalida ? (
            "Marcar Salida"
          ) : (
            "Marcar Entrada"
          )}
        </Button>

        {/* Mensajes de éxito */}
        {showSuccess && data?.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {data.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Mensajes de error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.includes("ya fue completada") ? (
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">
                    Si necesitas corregir tu horario, contacta con Recursos
                    Humanos.
                  </p>
                </div>
              ) : (
                error
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Información adicional */}
        <div className="text-xs text-gray-500 text-center pt-2">
          <p>
            Tu asistencia se registra automáticamente con la hora del servidor.
          </p>
          <p>Empleado ID: {empleadoId}</p>
        </div>
      </CardContent>
    </Card>
  );
};
