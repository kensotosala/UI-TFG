// services/asistenciaService.ts

import axios, { AxiosError } from "axios";
import {
  ActualizarAsistenciaDTO,
  Asistencia,
  AsistenciaBackend,
  AsistenciaDetallada,
  AsistenciasResponse,
  CrearAsistenciaDTO,
  EmpleadoAsistencia,
  EstadoAsistencia,
  FiltrosAsistencia,
  RegistroAsistencia,
  ResumenAsistencia,
} from "../types";

const API_BASE_URL = "https://localhost:7121/api";

/**
 * Manejo centralizado de errores
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Error al comunicarse con el servidor";
    throw new Error(message);
  }
  throw new Error("Error inesperado");
};

/**
 * Convertir TimeSpan "08:48:00" a minutos
 */
const timeSpanToMinutes = (timeSpan: string | null): number => {
  if (!timeSpan) return 0;
  const parts = timeSpan.split(":");
  const hours = parseInt(parts[0] || "0");
  const minutes = parseInt(parts[1] || "0");
  return hours * 60 + minutes;
};

/**
 * Extraer solo la fecha de un DateTime "2026-01-13T00:00:00"
 */
const extractDate = (dateTime: string): string => {
  return dateTime.split("T")[0]; // "2026-01-13"
};

/**
 * Extraer solo la hora de un DateTime "2026-01-13T08:12:00"
 */
const extractTime = (dateTime: string | null): string | null => {
  if (!dateTime) return null;
  const time = dateTime.split("T")[1];
  return time ? time.substring(0, 8) : null; // "08:12:00"
};

/**
 * Transformar datos del backend a formato frontend
 */
const transformBackendToFrontend = (
  backend: AsistenciaBackend
): AsistenciaDetallada => {
  const empleado: EmpleadoAsistencia = {
    id: backend.empleadoId.toString(),
    nombre: backend.nombreEmpleado.split(" ")[0] || "",
    apellido: backend.nombreEmpleado.split(" ").slice(1).join(" ") || "",
    nombreCompleto: backend.nombreEmpleado,
    email: "", // No viene del backend
    departamento: "", // No viene del backend
    cargo: "", // No viene del backend
  };

  return {
    id: backend.idAsistencia.toString(),
    empleadoId: backend.empleadoId.toString(),
    fecha: extractDate(backend.fechaRegistro),
    horaEntrada: extractTime(backend.horaEntrada),
    horaSalida: extractTime(backend.horaSalida),
    estado: backend.estado,
    horasTrabajadas: timeSpanToMinutes(backend.horasTrabajadas),
    createdAt: backend.fechaRegistro,
    updatedAt: backend.fechaRegistro,
    empleado: empleado,
  };
};

/**
 * Servicio para gestión de asistencias
 */
export const asistenciaService = {
  /**
   * Listar todas las asistencias con filtros opcionales
   */
  getAll: async (filtros?: FiltrosAsistencia): Promise<AsistenciasResponse> => {
    try {
      const params = new URLSearchParams();

      if (filtros?.empleadoId) params.append("empleadoId", filtros.empleadoId);
      if (filtros?.fechaInicio)
        params.append("fechaInicio", filtros.fechaInicio);
      if (filtros?.fechaFin) params.append("fechaFin", filtros.fechaFin);
      if (filtros?.estado && filtros.estado.length > 0) {
        filtros.estado.forEach((estado) => params.append("estado", estado));
      }
      if (filtros?.departamento)
        params.append("departamento", filtros.departamento);
      if (filtros?.page) params.append("page", filtros.page.toString());
      if (filtros?.limit) params.append("limit", filtros.limit.toString());

      // ✅ CAMBIO: El backend devuelve un array directo
      const { data } = await axios.get<AsistenciaBackend[]>(
        `${API_BASE_URL}/Asistencias?${params.toString()}`
      );

      console.log("✅ Backend data:", data); // DEBUG

      // ✅ TRANSFORMAR: Convertir datos del backend al formato frontend
      const transformedData = data.map(transformBackendToFrontend);

      console.log("✅ Transformed data:", transformedData); // DEBUG

      // ✅ RETORNAR: En el formato que espera el frontend
      return {
        data: transformedData,
        total: transformedData.length,
        page: filtros?.page || 1,
        limit: filtros?.limit || 20,
        totalPages: Math.ceil(transformedData.length / (filtros?.limit || 20)),
      };
    } catch (error) {
      console.error("❌ Error in getAll:", error);
      return handleApiError(error);
    }
  },

  /**
   * Obtener asistencia por ID con datos del empleado
   */
  getById: async (id: string): Promise<AsistenciaDetallada> => {
    try {
      const { data } = await axios.get<AsistenciaBackend>(
        `${API_BASE_URL}/Asistencias/${id}`
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener asistencias de un empleado específico
   */
  getByEmpleado: async (
    empleadoId: string,
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<AsistenciaDetallada[]> => {
    try {
      const params = new URLSearchParams({ empleadoId });
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const { data } = await axios.get<AsistenciaBackend[]>(
        `${API_BASE_URL}/Asistencias/empleado/${empleadoId}?${params.toString()}`
      );
      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crear nueva asistencia
   */
  create: async (asistencia: CrearAsistenciaDTO): Promise<Asistencia> => {
    try {
      const { data } = await axios.post<Asistencia>(
        `${API_BASE_URL}/Asistencias`,
        asistencia
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualizar asistencia existente
   */
  update: async (
    id: string,
    asistencia: ActualizarAsistenciaDTO
  ): Promise<Asistencia> => {
    try {
      const { data } = await axios.put<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}`,
        asistencia
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Eliminar asistencia
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/Asistencias/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Registrar entrada o salida rápida
   */
  registrar: async (
    registro: RegistroAsistencia
  ): Promise<AsistenciaDetallada> => {
    try {
      const { data } = await axios.post<AsistenciaDetallada>(
        `${API_BASE_URL}/Asistencias/registrar`,
        registro
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Cambiar estado de asistencia (presente, ausente, justificado, etc.)
   */
  cambiarEstado: async (
    id: string,
    estado: EstadoAsistencia,
    observaciones?: string
  ): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/estado`,
        { estado, observaciones }
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Justificar ausencia o tardanza
   */
  justificar: async (
    id: string,
    justificacion: {
      tipo: string;
      descripcion: string;
      documentoUrl?: string;
    }
  ): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/justificar`,
        justificacion
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Aprobar justificación
   */
  aprobarJustificacion: async (id: string): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/aprobar-justificacion`
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener resumen de asistencias por empleado
   */
  getResumen: async (
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ResumenAsistencia> => {
    try {
      const { data } = await axios.get<ResumenAsistencia>(
        `${API_BASE_URL}/Asistencias/resumen/${empleadoId}`,
        {
          params: { fechaInicio, fechaFin },
        }
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener resumen general (todos los empleados)
   */
  getResumenGeneral: async (
    fechaInicio: string,
    fechaFin: string,
    departamento?: string
  ): Promise<ResumenAsistencia[]> => {
    try {
      const params: Record<string, string> = { fechaInicio, fechaFin };
      if (departamento) params.departamento = departamento;

      const { data } = await axios.get<ResumenAsistencia[]>(
        `${API_BASE_URL}/Asistencias/resumen`,
        { params }
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Exportar asistencias a Excel/PDF
   */
  exportar: async (
    formato: "excel" | "pdf",
    filtros?: FiltrosAsistencia
  ): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      if (filtros?.empleadoId) params.append("empleadoId", filtros.empleadoId);
      if (filtros?.fechaInicio)
        params.append("fechaInicio", filtros.fechaInicio);
      if (filtros?.fechaFin) params.append("fechaFin", filtros.fechaFin);

      const { data } = await axios.get(
        `${API_BASE_URL}/Asistencias/exportar/${formato}?${params.toString()}`,
        {
          responseType: "blob",
        }
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener asistencia del día actual para un empleado
   */
  getAsistenciaHoy: async (
    empleadoId: string
  ): Promise<AsistenciaDetallada | null> => {
    try {
      const { data } = await axios.get<AsistenciaBackend>(
        `${API_BASE_URL}/Asistencias/hoy/${empleadoId}`
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // No hay asistencia registrada hoy
      }
      return handleApiError(error);
    }
  },
};

export default asistenciaService;
