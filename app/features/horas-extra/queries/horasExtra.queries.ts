import { useQuery } from "@tanstack/react-query";
import { horasExtraService } from "../services/horasExtra.service";
import { HoraExtra, FiltrosHorasExtras, ReporteHorasExtras } from "../types";

/**
 * Keys para el cache
 */
export const horasExtraKeys = {
  all: ["horasExtras"] as const,
  list: () => ["horasExtras", "list"] as const,
  detail: (id: number) => ["horasExtras", "detail", id] as const,
  filtros: (filtros: FiltrosHorasExtras) =>
    ["horasExtras", "filtros", filtros] as const,
  empleado: (empleadoId: number) =>
    ["horasExtras", "empleado", empleadoId] as const,
  pendientesJefe: (jefeId: number) =>
    ["horasExtras", "pendientes", jefeId] as const,
  reporte: (empleadoId: number, fechaInicio: string, fechaFin: string) =>
    ["horasExtras", "reporte", empleadoId, fechaInicio, fechaFin] as const,
};

/**
 * Query para obtener todas las horas extra
 */
export const useHorasExtrasQuery = () => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.list(),
    queryFn: () => horasExtraService.getAll(),
  });
};

/**
 * Query para obtener hora extra por ID
 */
export const useHoraExtraQuery = (id: number) => {
  return useQuery<HoraExtra>({
    queryKey: horasExtraKeys.detail(id),
    queryFn: () => horasExtraService.getById(id),
    enabled: !!id,
  });
};

/**
 * Query para buscar con filtros
 */
export const useHorasExtrasFiltrosQuery = (filtros: FiltrosHorasExtras) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.filtros(filtros),
    queryFn: () => horasExtraService.buscarPorFiltros(filtros),
  });
};

/**
 * Query para obtener horas extra por empleado
 */
export const useHorasExtrasByEmpleadoQuery = (empleadoId: number) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.empleado(empleadoId),
    queryFn: () => horasExtraService.getByEmpleado(empleadoId),
    enabled: !!empleadoId,
  });
};

/**
 * Query para obtener pendientes por jefe
 */
export const useHorasExtrasPendientesJefeQuery = (jefeId: number) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.pendientesJefe(jefeId),
    queryFn: () => horasExtraService.getPendientesByJefe(jefeId),
    enabled: !!jefeId,
  });
};

/**
 * Query para obtener reporte
 */
export const useReporteHorasExtrasQuery = (
  empleadoId: number,
  fechaInicio: string,
  fechaFin: string
) => {
  return useQuery<ReporteHorasExtras>({
    queryKey: horasExtraKeys.reporte(empleadoId, fechaInicio, fechaFin),
    queryFn: () =>
      horasExtraService.getReporte(empleadoId, fechaInicio, fechaFin),
    enabled: !!empleadoId && !!fechaInicio && !!fechaFin,
  });
};
