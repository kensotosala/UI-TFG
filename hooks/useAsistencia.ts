/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { asistenciaService } from "@/services/asistenciaService";
import { AsistenciaEstado } from "@/types/asistencia";

interface UseAsistenciaProps {
  empleadoId: number;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export const useAsistencia = ({
  empleadoId,
  onSuccess,
  onError,
}: UseAsistenciaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [estado, setEstado] = useState<AsistenciaEstado | null>(null);
  const [horaServer, setHoraServer] = useState<string>("");

  const marcarAsistencia = useCallback(async () => {
    if (!empleadoId) {
      onError?.("ID de empleado no válido");
      return;
    }

    setIsLoading(true);
    try {
      const response = await asistenciaService.marcarAsistencia(empleadoId);

      // Actualizar estado después de marcar
      const nuevoEstado = await asistenciaService.obtenerEstadoAsistencia(
        empleadoId
      );
      setEstado(nuevoEstado);

      // Actualizar hora del servidor
      setHoraServer(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      onSuccess?.(response.message || "Asistencia registrada exitosamente");
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [empleadoId, onSuccess, onError]);

  const cargarEstado = useCallback(async () => {
    try {
      const estadoActual = await asistenciaService.obtenerEstadoAsistencia(
        empleadoId
      );
      setEstado(estadoActual);
    } catch (error) {
      console.error("Error cargando estado:", error);
    }
  }, [empleadoId]);

  return {
    marcarAsistencia,
    cargarEstado,
    isLoading,
    estado,
    horaServer,
  };
};
