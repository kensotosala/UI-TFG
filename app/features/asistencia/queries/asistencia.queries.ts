import { useQuery } from "@tanstack/react-query";
import {
  AsistenciaDetallada,
  AsistenciasResponse,
  FiltrosAsistencia,
  ResumenAsistencia,
} from "../types";
import asistenciaService from "../services/asistencia.service";

/**
 * Keys para el cache
 */
export const asistenciaKeys = {
  all: ["asistencias"] as const,
  list: (filtros?: FiltrosAsistencia) =>
    ["asistencias", "list", filtros] as const,
  detail: (id: string) => ["asistencias", "detail", id] as const,
  empleado: (empleadoId: string) =>
    ["asistencias", "empleado", empleadoId] as const,
  hoy: (empleadoId: string) => ["asistencias", "hoy", empleadoId] as const,
  resumen: (empleadoId: string, fechaInicio: string, fechaFin: string) =>
    ["asistencias", "resumen", empleadoId, fechaInicio, fechaFin] as const,
  resumenGeneral: (
    fechaInicio: string,
    fechaFin: string,
    departamento?: string
  ) =>
    [
      "asistencias",
      "resumen-general",
      fechaInicio,
      fechaFin,
      departamento,
    ] as const,
};

/**
 * Obtener todas las asistencias
 */
export const useAsistenciasQuery = (filtros?: FiltrosAsistencia) => {
  return useQuery<AsistenciasResponse>({
    queryKey: asistenciaKeys.list(filtros),
    queryFn: () => asistenciaService.getAll(filtros),
  });
};

/**
 * Obtener asistencia por ID
 */
export const useAsistenciaQuery = (id: string) => {
  return useQuery<AsistenciaDetallada>({
    queryKey: asistenciaKeys.detail(id),
    queryFn: () => asistenciaService.getById(id),
    enabled: !!id,
  });
};

/**
 * Obtener asistencias por empleado
 */
export const useAsistenciasByEmpleadoQuery = (
  empleadoId: string,
  fechaInicio?: string,
  fechaFin?: string
) => {
  return useQuery<AsistenciaDetallada[]>({
    queryKey: asistenciaKeys.empleado(empleadoId),
    queryFn: () =>
      asistenciaService.getByEmpleado(empleadoId, fechaInicio, fechaFin),
    enabled: !!empleadoId,
  });
};

/**
 * Obtener asistencia del día actual
 */
export const useAsistenciaHoyQuery = (empleadoId: string) => {
  return useQuery<AsistenciaDetallada | null>({
    queryKey: asistenciaKeys.hoy(empleadoId),
    queryFn: () => asistenciaService.getAsistenciaHoy(empleadoId),
    enabled: !!empleadoId,
  });
};

/**
 * Obtener resumen de asistencias de un empleado
 */
export const useResumenAsistenciaQuery = (
  empleadoId: string,
  fechaInicio: string,
  fechaFin: string
) => {
  return useQuery<ResumenAsistencia>({
    queryKey: asistenciaKeys.resumen(empleadoId, fechaInicio, fechaFin),
    queryFn: () =>
      asistenciaService.getResumen(empleadoId, fechaInicio, fechaFin),
    enabled: !!empleadoId && !!fechaInicio && !!fechaFin,
  });
};

/**
 * Obtener resumen general
 */
export const useResumenGeneralQuery = (
  fechaInicio: string,
  fechaFin: string,
  departamento?: string
) => {
  return useQuery<ResumenAsistencia[]>({
    queryKey: asistenciaKeys.resumenGeneral(
      fechaInicio,
      fechaFin,
      departamento
    ),
    queryFn: () =>
      asistenciaService.getResumenGeneral(fechaInicio, fechaFin, departamento),
    enabled: !!fechaInicio && !!fechaFin,
  });
};
