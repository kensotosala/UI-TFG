import axios from "axios";
import {
  HoraExtra,
  HoraExtraBackend,
  CrearHoraExtraDTO,
  ActualizarHoraExtraDTO,
  AprobarRechazarHoraExtraDTO,
  FiltrosHorasExtras,
  ReporteHorasExtras,
} from "../types";
import { HoraExtraHoyDTO } from "../../VistaEmpleado/asistencia-empleado/types";

const API_BASE_URL = "https://localhost:7121/api/HorasExtras";

/**
 * Convertir TimeSpan "08:48:00" a minutos
 */
const timeSpanToMinutes = (timeSpan: string): number => {
  if (!timeSpan) return 0;
  const parts = timeSpan.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  return hours * 60 + minutes;
};

/**
 * Transformar datos del backend a formato frontend
 */
const transformBackendToFrontend = (backend: HoraExtraBackend): HoraExtra => ({
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
});

/**
 * Servicio para gestión de horas extra
 */
export const horasExtraService = {
  /**
   * Obtener todas las horas extra
   */
  async getAll(): Promise<HoraExtra[]> {
    const { data } = await axios.get<HoraExtraBackend[]>(API_BASE_URL);
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener hora extra por ID
   */
  async getById(id: number): Promise<HoraExtra> {
    const { data } = await axios.get<HoraExtraBackend>(`${API_BASE_URL}/${id}`);
    return transformBackendToFrontend(data);
  },

  /**
   * Buscar horas extra con filtros
   */
  async buscarPorFiltros(filtros: FiltrosHorasExtras): Promise<HoraExtra[]> {
    const { data } = await axios.post<HoraExtraBackend[]>(
      `${API_BASE_URL}/buscar`,
      filtros,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener horas extra por empleado
   */
  async getByEmpleado(empleadoId: number): Promise<HoraExtra[]> {
    const { data } = await axios.get<HoraExtraBackend[]>(
      `${API_BASE_URL}/empleado/${empleadoId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener solicitudes pendientes de un jefe
   */
  async getPendientesByJefe(jefeId: number): Promise<HoraExtra[]> {
    const { data } = await axios.get<HoraExtraBackend[]>(
      `${API_BASE_URL}/pendientes/jefe/${jefeId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Crear nueva solicitud de hora extra
   */
  async create(dto: CrearHoraExtraDTO): Promise<HoraExtra> {
    const { data } = await axios.post<HoraExtraBackend>(API_BASE_URL, dto);
    return transformBackendToFrontend(data);
  },

  /**
   * Actualizar solicitud de hora extra
   */
  async update(id: number, dto: ActualizarHoraExtraDTO): Promise<void> {
    await axios.put(`${API_BASE_URL}/${id}`, dto);
  },

  /**
   * Eliminar solicitud de hora extra
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  /**
   * Aprobar o rechazar solicitud
   */
  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarHoraExtraDTO,
  ): Promise<void> {
    await axios.patch(`${API_BASE_URL}/${id}/aprobar-rechazar`, dto);
  },

  /**
   * Obtener reporte de horas extra
   */
  async getReporte(
    empleadoId: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteHorasExtras> {
    const { data } = await axios.get<ReporteHorasExtras>(
      `${API_BASE_URL}/reporte/${empleadoId}`,
      { params: { fechaInicio, fechaFin } },
    );
    return data;
  },

  /**
   * Valorar si existe una solicitud de hora extra válida para hoy
   */
  async getHoraExtraActiva(empleadoId: number): Promise<HoraExtraHoyDTO> {
    const { data } = await axios.get<HoraExtraHoyDTO>(
      `${API_BASE_URL}/activa/${empleadoId}`,
    );
    return data;
  },
};
