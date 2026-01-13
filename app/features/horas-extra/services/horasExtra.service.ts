/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError } from "axios";
import {
  HoraExtra,
  HoraExtraBackend,
  CrearHoraExtraDTO,
  ActualizarHoraExtraDTO,
  AprobarRechazarHoraExtraDTO,
  FiltrosHorasExtras,
  ReporteHorasExtras,
} from "../types";

const API_BASE_URL = "https://localhost:7121/api";

/**
 * Manejo centralizado de errores
 */
// const handleApiError = (error: unknown): never => {
//   if (axios.isAxiosError(error)) {
//     const axiosError = error as AxiosError<{ message?: string }>;
//     const message =
//       axiosError.response?.data?.message ||
//       axiosError.message ||
//       "Error al comunicarse con el servidor";
//     throw new Error(message);
//   }
//   throw new Error("Error inesperado");
// };

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("🚨 ERROR 400 BACKEND:", error.response?.data);
    throw error; // ← IMPORTANTE
  }

  throw error;
};

/**
 * Convertir TimeSpan "08:48:00" a minutos
 */
const timeSpanToMinutes = (timeSpan: string): number => {
  if (!timeSpan) return 0;
  const parts = timeSpan.split(":");
  const hours = parseInt(parts[0] || "0");
  const minutes = parseInt(parts[1] || "0");
  return hours * 60 + minutes;
};

/**
 * Transformar datos del backend a formato frontend
 */
const transformBackendToFrontend = (backend: HoraExtraBackend): HoraExtra => {
  return {
    idHoraExtra: backend.idHoraExtra,
    empleadoId: backend.empleadoId,
    codigoEmpleado: backend.codigoEmpleado,
    nombreEmpleado: backend.nombreEmpleado,
    fechaSolicitud: backend.fechaSolicitud,
    fechaInicio: backend.fechaInicio,
    fechaFin: backend.fechaFin,
    horasTotales: timeSpanToMinutes(backend.horasTotales),
    tipoHoraExtra: backend.tipoHoraExtra,
    motivo: backend.motivo,
    estadoSolicitud: backend.estadoSolicitud,
    jefeApruebaId: backend.jefeApruebaId,
    nombreJefe: backend.nombreJefe,
    fechaAprobacion: backend.fechaAprobacion,
    fechaCreacion: backend.fechaCreacion,
  };
};

/**
 * Servicio para gestión de horas extra
 */
export const horasExtraService = {
  /**
   * Obtener todas las horas extra
   */
  getAll: async (): Promise<HoraExtra[]> => {
    try {
      const { data } = await axios.get<HoraExtraBackend[]>(
        `${API_BASE_URL}/HorasExtras`
      );
      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener hora extra por ID
   */
  getById: async (id: number): Promise<HoraExtra> => {
    try {
      const { data } = await axios.get<HoraExtraBackend>(
        `${API_BASE_URL}/HorasExtras/${id}`
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Buscar horas extra con filtros
   */
  buscarPorFiltros: async (
    filtros: FiltrosHorasExtras
  ): Promise<HoraExtra[]> => {
    try {
      const { data } = await axios.post<HoraExtraBackend[]>(
        `${API_BASE_URL}/HorasExtras/buscar`,
        filtros
      );
      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener horas extra por empleado
   */
  getByEmpleado: async (empleadoId: number): Promise<HoraExtra[]> => {
    try {
      const { data } = await axios.get<HoraExtraBackend[]>(
        `${API_BASE_URL}/HorasExtras/empleado/${empleadoId}`
      );
      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener solicitudes pendientes de un jefe
   */
  getPendientesByJefe: async (jefeId: number): Promise<HoraExtra[]> => {
    try {
      const { data } = await axios.get<HoraExtraBackend[]>(
        `${API_BASE_URL}/HorasExtras/pendientes/jefe/${jefeId}`
      );
      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crear nueva solicitud de hora extra
   */
  create: async (dto: CrearHoraExtraDTO): Promise<HoraExtra> => {
    try {
      const { data } = await axios.post<HoraExtraBackend>(
        `${API_BASE_URL}/HorasExtras`,
        dto
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualizar solicitud de hora extra
   */
  update: async (id: number, dto: ActualizarHoraExtraDTO): Promise<void> => {
    try {
      await axios.put(`${API_BASE_URL}/HorasExtras/${id}`, dto);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Eliminar solicitud de hora extra
   */
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/HorasExtras/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Aprobar o rechazar solicitud
   */
  aprobarRechazar: async (
    id: number,
    dto: AprobarRechazarHoraExtraDTO
  ): Promise<void> => {
    try {
      await axios.patch(
        `${API_BASE_URL}/HorasExtras/${id}/aprobar-rechazar`,
        dto
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener reporte de horas extra
   */
  getReporte: async (
    empleadoId: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteHorasExtras> => {
    try {
      const { data } = await axios.get<ReporteHorasExtras>(
        `${API_BASE_URL}/HorasExtras/reporte/${empleadoId}`,
        {
          params: { fechaInicio, fechaFin },
        }
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
