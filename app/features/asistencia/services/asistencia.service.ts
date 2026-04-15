import {
  ActualizarHoraExtraDTO,
  AprobarRechazarHoraExtraDTO,
  CrearHoraExtraDTO,
  FiltrosHorasExtras,
  HoraExtra,
  HoraExtraBackend,
  ReporteHorasExtras,
} from "../../horas-extra/types";
import { HoraExtraHoyDTO } from "../../VistaEmpleado/asistencia-empleado/types";
import api from "@/lib/axios-config";

const BASE = "/HorasExtras";

const timeSpanToMinutes = (timeSpan: string): number => {
  if (!timeSpan) return 0;
  const parts = timeSpan.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  return hours * 60 + minutes;
};

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

export const horasExtraService = {
  async getAll(): Promise<HoraExtra[]> {
    const { data } = await api.get<HoraExtraBackend[]>(BASE);
    return data.map(transformBackendToFrontend);
  },

  async getById(id: number): Promise<HoraExtra> {
    const { data } = await api.get<HoraExtraBackend>(`${BASE}/${id}`);
    return transformBackendToFrontend(data);
  },

  async buscarPorFiltros(filtros: FiltrosHorasExtras): Promise<HoraExtra[]> {
    const { data } = await api.post<HoraExtraBackend[]>(
      `${BASE}/buscar`,
      filtros,
    );
    return data.map(transformBackendToFrontend);
  },

  async getByEmpleado(empleadoId: number): Promise<HoraExtra[]> {
    const { data } = await api.get<HoraExtraBackend[]>(
      `${BASE}/empleado/${empleadoId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  async getPendientesByJefe(jefeId: number): Promise<HoraExtra[]> {
    const { data } = await api.get<HoraExtraBackend[]>(
      `${BASE}/pendientes/jefe/${jefeId}`,
    );
    return data.map(transformBackendToFrontend);
  },

  async create(dto: CrearHoraExtraDTO): Promise<HoraExtra> {
    const { data } = await api.post<HoraExtraBackend>(BASE, dto);
    return transformBackendToFrontend(data);
  },

  async update(id: number, dto: ActualizarHoraExtraDTO): Promise<void> {
    await api.put(`${BASE}/${id}`, dto);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },

  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarHoraExtraDTO,
  ): Promise<void> {
    await api.patch(`${BASE}/${id}/aprobar-rechazar`, dto);
  },

  async getReporte(
    empleadoId: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ReporteHorasExtras> {
    const { data } = await api.get<ReporteHorasExtras>(
      `${BASE}/reporte/${empleadoId}`,
      { params: { fechaInicio, fechaFin } },
    );
    return data;
  },

  async getHoraExtraActiva(empleadoId: number): Promise<HoraExtraHoyDTO> {
    const { data } = await api.get<HoraExtraHoyDTO>(
      `${BASE}/activa/${empleadoId}`,
    );
    return data;
  },
};
