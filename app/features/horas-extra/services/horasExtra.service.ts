import api from "@/lib/axios-config";
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

/**
 * Convertir TimeSpan "08:48:00" a minutos
 */
const timeSpanToMinutes = (timeSpan: string): number => {
  if (!timeSpan) return 0;
  const [hours = "0", minutes = "0"] = timeSpan.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
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
    const { data } = await api.get<HoraExtraBackend[]>("/HorasExtras");
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener por ID
   */
  async getById(id: number): Promise<HoraExtra> {
    const { data } = await api.get<HoraExtraBackend>(`/HorasExtras/${id}`);
    return transformBackendToFrontend(data);
  },

  /**
   * Buscar por filtros
   */
  async buscarPorFiltros(filtros: FiltrosHorasExtras): Promise<HoraExtra[]> {
    const { data } = await api.post<HoraExtraBackend[]>(
      `/HorasExtras/buscar`,
      filtros,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener por empleado
   */
  async getByEmpleado(empleadoId: number): Promise<HoraExtra[]> {
    const { data } = await api.get<HoraExtraBackend[]>(
      `/HorasExtras/empleado/${empleadoId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Obtener pendientes por jefe
   */
  async getPendientesByJefe(jefeId: number): Promise<HoraExtra[]> {
    const { data } = await api.get<HoraExtraBackend[]>(
      `/HorasExtras/pendientes/jefe/${jefeId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  /**
   * Crear solicitud
   */
  async create(dto: CrearHoraExtraDTO): Promise<HoraExtra> {
    const { data } = await api.post<HoraExtraBackend>(`/HorasExtras`, dto);
    return transformBackendToFrontend(data);
  },

  /**
   * Actualizar solicitud
   */
  async update(id: number, dto: ActualizarHoraExtraDTO): Promise<void> {
    await api.put(`/HorasExtras/${id}`, dto);
  },

  /**
   * Eliminar solicitud
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/HorasExtras/${id}`);
  },

  /**
   * Aprobar o rechazar
   */
  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarHoraExtraDTO,
  ): Promise<void> {
    await api.patch(`/HorasExtras/${id}/aprobar-rechazar`, dto);
  },

  /**
   * Obtener reporte
   */
  async getReporte(
    empleadoId: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteHorasExtras> {
    const { data } = await api.get<ReporteHorasExtras>(
      `/HorasExtras/reporte/${empleadoId}`,
      {
        params: { fechaInicio, fechaFin },
      },
    );
    return data;
  },

  /**
   * Obtener hora extra activa hoy
   */
  async getHoraExtraActiva(empleadoId: number): Promise<HoraExtraHoyDTO> {
    const { data } = await api.get<HoraExtraHoyDTO>(
      `/HorasExtras/activa/${empleadoId}`,
    );
    return data;
  },
};
