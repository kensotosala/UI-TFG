/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MarcacionResponse, MarcarAsistenciaRequest } from "@/types/asistencia";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5071/api";

// Tipo opcional del estado de asistencia
export type AsistenciaEstado = {
  horaEntrada?: string | null;
  horaSalida?: string | null;
  estado?: string;
  mensaje?: string;
};

export const useMarcacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MarcacionResponse | null>(null);
  const [asistenciaEstado, setAsistenciaEstado] =
    useState<AsistenciaEstado | null>(null);

  // Función para obtener el estado actual de la asistencia
  const obtenerEstadoAsistencia = async (
    empleadoId: number
  ): Promise<AsistenciaEstado | null> => {
    try {
      const response = await fetch(
        `${API_URL}/asistencia/estado/${empleadoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Error al obtener estado de asistencia:",
          response.statusText
        );
        return null;
      }

      const estado = await response.json();
      setAsistenciaEstado(estado);
      return estado;
    } catch (err) {
      console.error("Error al obtener estado de asistencia:", err);
      return null;
    }
  };

  // Función para marcar asistencia
  const marcarAsistencia = async (
    empleadoId: number
  ): Promise<MarcacionResponse> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const requestData: MarcarAsistenciaRequest = { empleadoId };

      const response = await fetch(`${API_URL}/asistencia/marcar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      // La API siempre devuelve 200, verificamos "exito"
      const result: MarcacionResponse = {
        success: responseData.exito || false,
        message:
          responseData.mensaje ||
          (responseData.exito
            ? "Asistencia marcada"
            : "No se pudo marcar asistencia"),
        data: responseData,
      };

      setData(result);

      // Actualizar estado de asistencia
      await obtenerEstadoAsistencia(empleadoId);

      return result;
    } catch (err: any) {
      const errorMsg = err.message || "Error desconocido al marcar asistencia";
      setError(errorMsg);

      const errorResult: MarcacionResponse = {
        success: false,
        message: errorMsg,
      };

      setData(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    marcarAsistencia,
    obtenerEstadoAsistencia,
    loading,
    error,
    data,
    asistenciaEstado,
  };
};
