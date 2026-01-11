/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  AsistenciaEstado,
  MarcacionResponse,
  MarcarAsistenciaRequest,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api";

export const asistenciaService = {
  async marcarAsistencia(empleadoId: number): Promise<MarcacionResponse> {
    try {
      const response = await axios.post<MarcacionResponse>(
        `${API_BASE_URL}/asistencia/marcar`,
        { empleadoId } as MarcarAsistenciaRequest
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al marcar la asistencia. Por favor, intente nuevamente."
      );
    }
  },

  async obtenerEstadoAsistencia(empleadoId: number): Promise<AsistenciaEstado> {
    try {
      const response = await axios.get<AsistenciaEstado>(
        `${API_BASE_URL}/asistencia/estado/${empleadoId}`
      );
      return response.data;
    } catch {
      return {
        tieneRegistro: false,
        estado: "PENDIENTE",
        mensaje: "Listo para marcar entrada",
      };
    }
  },
};
