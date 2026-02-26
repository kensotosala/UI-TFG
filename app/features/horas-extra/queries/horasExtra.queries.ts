import { useQuery } from "@tanstack/react-query";
import { horasExtraService } from "../services/horasExtra.service";
import { HoraExtra, FiltrosHorasExtras, ReporteHorasExtras } from "../types";
import { HoraExtraHoyDTO } from "../../VistaEmpleado/asistencia-empleado/types";

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
  horaExtraActiva: (empleadoId: number) =>
    ["horasExtras", "activa", empleadoId] as const,
};

export const useHorasExtrasQuery = () => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.list(),
    queryFn: () => horasExtraService.getAll(),
  });
};

export const useHoraExtraQuery = (id: number) => {
  return useQuery<HoraExtra>({
    queryKey: horasExtraKeys.detail(id),
    queryFn: () => horasExtraService.getById(id),
    enabled: !!id,
  });
};

export const useHorasExtrasFiltrosQuery = (filtros: FiltrosHorasExtras) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.filtros(filtros),
    queryFn: () => horasExtraService.buscarPorFiltros(filtros),
  });
};

export const useHorasExtrasByEmpleadoQuery = (empleadoId: number) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.empleado(empleadoId),
    queryFn: () => horasExtraService.getByEmpleado(empleadoId),
    enabled: !!empleadoId,
  });
};

export const useHorasExtrasPendientesJefeQuery = (jefeId: number) => {
  return useQuery<HoraExtra[]>({
    queryKey: horasExtraKeys.pendientesJefe(jefeId),
    queryFn: () => horasExtraService.getPendientesByJefe(jefeId),
    enabled: !!jefeId,
  });
};

export const useReporteHorasExtrasQuery = (
  empleadoId: number,
  fechaInicio: string,
  fechaFin: string,
) => {
  return useQuery<ReporteHorasExtras>({
    queryKey: horasExtraKeys.reporte(empleadoId, fechaInicio, fechaFin),
    queryFn: () =>
      horasExtraService.getReporte(empleadoId, fechaInicio, fechaFin),
    enabled: !!empleadoId && !!fechaInicio && !!fechaFin,
  });
};

export const useHoraExtraActivaQuery = (empleadoId?: number) => {
  return useQuery<HoraExtraHoyDTO>({
    queryKey: horasExtraKeys.horaExtraActiva(empleadoId ?? 0),
    queryFn: () => horasExtraService.getHoraExtraActiva(empleadoId!),
    enabled: !!empleadoId,
  });
};
