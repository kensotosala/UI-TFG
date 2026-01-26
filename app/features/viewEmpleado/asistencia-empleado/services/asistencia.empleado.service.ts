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

interface EstadoAsistenciaResponse {
  tieneRegistro: boolean;
  puedeMarcarEntrada: boolean;
  puedeMarcarSalida: boolean;
  estado: string;
  horaEntrada?: string;
  horaSalida?: string;
  mensaje: string;
}

interface MarcarResponse {
  exito: boolean;
  mensaje: string;
  accion: string;
  hora: string;
  estado: string;
  horaEntrada?: string;
  horaSalida?: string;
  puedeMarcarEntrada: boolean;
  puedeMarcarSalida: boolean;
}

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

const formatDateForBackend = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
};

const formatTimeForBackend = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const combinarFechaHora = (fecha: string, hora: string): string => {
  return `${fecha}T${hora}`;
};

const timeSpanToMinutes = (timeSpan: string | null): number => {
  if (!timeSpan) return 0;
  const parts = timeSpan.split(":");
  const hours = parseInt(parts[0] || "0");
  const minutes = parseInt(parts[1] || "0");
  return hours * 60 + minutes;
};

const extractDate = (dateTime: string): string => {
  return dateTime.split("T")[0];
};

const extractTime = (dateTime: string | null): string | null => {
  if (!dateTime) return null;
  const time = dateTime.split("T")[1];
  return time ? time.substring(0, 8) : null;
};

const transformBackendToFrontend = (
  backend: AsistenciaBackend,
): AsistenciaDetallada => {
  const empleado: EmpleadoAsistencia = {
    id: backend.empleadoId.toString(),
    nombre: backend.nombreEmpleado.split(" ")[0] || "",
    apellido: backend.nombreEmpleado.split(" ").slice(1).join(" ") || "",
    nombreCompleto: backend.nombreEmpleado,
    email: "",
    departamento: "",
    cargo: "",
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

export const asistenciaService = {
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

      const { data } = await axios.get<AsistenciaBackend[]>(
        `${API_BASE_URL}/Asistencias?${params.toString()}`,
      );

      const transformedData = data.map(transformBackendToFrontend);

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

  getById: async (id: string): Promise<AsistenciaDetallada> => {
    try {
      const { data } = await axios.get<AsistenciaBackend>(
        `${API_BASE_URL}/Asistencias/${id}`,
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getByEmpleado: async (
    empleadoId: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<AsistenciaDetallada[]> => {
    try {
      const payload: Record<string, unknown> = {
        empleadoId: Number(empleadoId),
      };

      if (fechaInicio) payload.fechaInicio = fechaInicio;
      if (fechaFin) payload.fechaFin = fechaFin;

      const { data } = await axios.post<AsistenciaBackend[]>(
        `${API_BASE_URL}/Asistencias/buscar`,
        payload,
      );

      return data.map(transformBackendToFrontend);
    } catch (error) {
      return handleApiError(error);
    }
  },

  create: async (data: CrearAsistenciaDTO): Promise<Asistencia> => {
    try {
      if (!data.empleadoId || !data.fechaRegistro || !data.estado) {
        throw new Error(
          "Faltan datos requeridos: empleadoId, fechaRegistro y estado son obligatorios",
        );
      }

      const payload: Record<string, unknown> = {
        empleadoId: Number(data.empleadoId),
        fechaRegistro: formatDateForBackend(data.fechaRegistro),
        estado: data.estado,
      };

      if (data.horaEntrada) {
        const horaFormateada = data.horaEntrada.includes("T")
          ? formatTimeForBackend(data.horaEntrada)
          : data.horaEntrada;

        payload.horaEntrada = combinarFechaHora(
          formatDateForBackend(data.fechaRegistro),
          horaFormateada,
        );
      }

      if (data.horaSalida) {
        const horaFormateada = data.horaSalida.includes("T")
          ? formatTimeForBackend(data.horaSalida)
          : data.horaSalida;

        payload.horaSalida = combinarFechaHora(
          formatDateForBackend(data.fechaRegistro),
          horaFormateada,
        );
      }

      console.log("📤 Payload enviado al backend (CREATE):", payload);

      const response = await axios.post<Asistencia>(
        `${API_BASE_URL}/Asistencias`,
        payload,
      );

      console.log("✅ Respuesta del backend (CREATE):", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error al crear asistencia:", error);
      return handleApiError(error);
    }
  },

  update: async (
    id: string,
    data: ActualizarAsistenciaDTO,
  ): Promise<Asistencia> => {
    try {
      const asistenciaActual = await asistenciaService.getById(id);
      const fechaBase = asistenciaActual.fecha;

      const payload: Record<string, unknown> = {
        empleadoId: Number(asistenciaActual.empleadoId),
        fechaRegistro: fechaBase,
        estado: data.estado || asistenciaActual.estado,
      };

      if (data.horaEntrada && data.horaEntrada.trim() !== "") {
        const horaFormateada = data.horaEntrada.includes("T")
          ? formatTimeForBackend(data.horaEntrada)
          : data.horaEntrada;

        payload.horaEntrada = combinarFechaHora(fechaBase, horaFormateada);
      } else if (asistenciaActual.horaEntrada) {
        payload.horaEntrada = combinarFechaHora(
          fechaBase,
          asistenciaActual.horaEntrada,
        );
      }

      if (data.horaSalida && data.horaSalida.trim() !== "") {
        const horaFormateada = data.horaSalida.includes("T")
          ? formatTimeForBackend(data.horaSalida)
          : data.horaSalida;

        payload.horaSalida = combinarFechaHora(fechaBase, horaFormateada);
      } else if (asistenciaActual.horaSalida) {
        payload.horaSalida = combinarFechaHora(
          fechaBase,
          asistenciaActual.horaSalida,
        );
      }

      console.log("📤 Payload enviado al backend (UPDATE):", payload);

      const response = await axios.put<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}`,
        payload,
      );

      console.log("✅ Respuesta del backend (UPDATE):", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar asistencia:", error);
      return handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/Asistencias/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  registrar: async (
    registro: RegistroAsistencia,
  ): Promise<AsistenciaDetallada> => {
    try {
      const { data } = await axios.post<AsistenciaDetallada>(
        `${API_BASE_URL}/Asistencias/registrar`,
        registro,
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  cambiarEstado: async (
    id: string,
    estado: EstadoAsistencia,
    observaciones?: string,
  ): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/estado`,
        { estado, observaciones },
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  justificar: async (
    id: string,
    justificacion: {
      tipo: string;
      descripcion: string;
      documentoUrl?: string;
    },
  ): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/justificar`,
        justificacion,
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  aprobarJustificacion: async (id: string): Promise<Asistencia> => {
    try {
      const { data } = await axios.patch<Asistencia>(
        `${API_BASE_URL}/Asistencias/${id}/aprobar-justificacion`,
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getResumen: async (
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ResumenAsistencia> => {
    try {
      const { data } = await axios.get<ResumenAsistencia>(
        `${API_BASE_URL}/Asistencias/resumen/${empleadoId}`,
        {
          params: { fechaInicio, fechaFin },
        },
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getResumenGeneral: async (
    fechaInicio: string,
    fechaFin: string,
    departamento?: string,
  ): Promise<ResumenAsistencia[]> => {
    try {
      const params: Record<string, string> = { fechaInicio, fechaFin };
      if (departamento) params.departamento = departamento;

      const { data } = await axios.get<ResumenAsistencia[]>(
        `${API_BASE_URL}/Asistencias/resumen`,
        { params },
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  exportar: async (
    formato: "excel" | "pdf",
    filtros?: FiltrosAsistencia,
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
        },
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAsistenciaHoy: async (
    empleadoId: string,
  ): Promise<AsistenciaDetallada | null> => {
    try {
      const { data } = await axios.get<AsistenciaBackend>(
        `${API_BASE_URL}/Asistencias/hoy/${empleadoId}`,
      );
      return transformBackendToFrontend(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      return handleApiError(error);
    }
  },

  marcar: async (empleadoId: number): Promise<MarcarResponse> => {
    try {
      const { data } = await axios.post<MarcarResponse>(
        `${API_BASE_URL}/Asistencias/marcar`,
        { empleadoId },
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getEstado: async (empleadoId: number): Promise<EstadoAsistenciaResponse> => {
    try {
      const { data } = await axios.get<EstadoAsistenciaResponse>(
        `${API_BASE_URL}/Asistencias/estado/${empleadoId}`,
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default asistenciaService;
