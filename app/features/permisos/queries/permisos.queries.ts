import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { Permiso, FiltrosPermisos } from "../types";
import { permisoService } from "../services/permisos.service";

/**
 * Query Keys
 */
export const permisoKeys = {
  all: ["permisos"] as const,
  lists: () => [...permisoKeys.all, "list"] as const,
  details: () => [...permisoKeys.all, "detail"] as const,
  detail: (id: number) => [...permisoKeys.details(), id] as const,
  filtros: (filtros: FiltrosPermisos) =>
    [...permisoKeys.lists(), "filtros", filtros] as const,
  empleado: (empleadoId: number) =>
    [...permisoKeys.lists(), "empleado", empleadoId] as const,
  pendientesJefe: (jefeId: number) =>
    [...permisoKeys.lists(), "pendientes", jefeId] as const,
};

/**
 * Default options
 */
const defaultOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 2,
};

/**
 * Obtener todos
 */
export const usePermisosQuery = (
  options?: Partial<
    UseQueryOptions<
      Permiso[],
      Error,
      Permiso[],
      ReturnType<typeof permisoKeys.lists>
    >
  >,
): UseQueryResult<Permiso[]> => {
  return useQuery({
    queryKey: permisoKeys.lists(),
    queryFn: permisoService.getAll,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener por ID
 */
export const usePermisoQuery = (
  id: number,
  options?: Partial<
    UseQueryOptions<
      Permiso,
      Error,
      Permiso,
      ReturnType<typeof permisoKeys.detail>
    >
  >,
): UseQueryResult<Permiso> => {
  return useQuery({
    queryKey: permisoKeys.detail(id),
    queryFn: () => permisoService.getById(id),
    enabled: !!id,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener por empleado
 */
export const usePermisosByEmpleadoQuery = (
  empleadoId: number,
  options?: Partial<
    UseQueryOptions<
      Permiso[],
      Error,
      Permiso[],
      ReturnType<typeof permisoKeys.empleado>
    >
  >,
): UseQueryResult<Permiso[]> => {
  return useQuery({
    queryKey: permisoKeys.empleado(empleadoId),
    queryFn: () => permisoService.getByEmpleado(empleadoId), // ✅ FIX
    enabled: !!empleadoId,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener pendientes por jefe
 */
export const usePermisosPendientesJefeQuery = (
  jefeId: number,
  options?: Partial<
    UseQueryOptions<
      Permiso[],
      Error,
      Permiso[],
      ReturnType<typeof permisoKeys.pendientesJefe>
    >
  >,
): UseQueryResult<Permiso[]> => {
  return useQuery({
    queryKey: permisoKeys.pendientesJefe(jefeId),
    queryFn: () => permisoService.getPendientesByJefe(jefeId), // ⚠️ asegúrate que exista
    enabled: !!jefeId,
    ...defaultOptions,
    ...options,
  });
};
