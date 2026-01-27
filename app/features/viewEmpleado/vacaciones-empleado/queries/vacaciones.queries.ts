import { useQuery } from "@tanstack/react-query";
import vacacionesService from "../services/vacaciones.service";
import {
  ListarVacacionesDTO,
  ListarVacacionByIdDTO,
  SaldoVacacionesDTO,
  ResultDTO,
} from "../vacaciones.types";

// ========================================
// QUERY KEYS (Constantes para cache)
// ========================================

export const vacacionesKeys = {
  all: ["vacaciones"] as const,
  lists: () => [...vacacionesKeys.all, "list"] as const,
  list: (filters?: string) => [...vacacionesKeys.lists(), filters] as const,
  details: () => [...vacacionesKeys.all, "detail"] as const,
  detail: (id: number) => [...vacacionesKeys.details(), id] as const,
  byEmpleado: (empleadoId: number) =>
    [...vacacionesKeys.all, "empleado", empleadoId] as const,
  byEstado: (estado: string) =>
    [...vacacionesKeys.all, "estado", estado] as const,
  saldo: (empleadoId: number, anio?: number) =>
    [...vacacionesKeys.all, "saldo", empleadoId, anio] as const,
  historialSaldo: (empleadoId: number) =>
    [...vacacionesKeys.all, "historialSaldo", empleadoId] as const,
};

// ========================================
// QUERY HOOKS (Solo lecturas - GET)
// ========================================

/**
 * Hook para obtener todas las vacaciones
 * GET /api/v1/Vacaciones
 *
 * @example
 * const { data, isLoading, error } = useVacacionesQuery();
 * const vacaciones = data?.datos || [];
 */
export const useVacacionesQuery = () => {
  return useQuery<ResultDTO<ListarVacacionesDTO[]>>({
    queryKey: vacacionesKeys.lists(),
    queryFn: () => vacacionesService.obtenerTodas(),
  });
};

/**
 * Hook para obtener una vacación por ID
 * GET /api/v1/Vacaciones/{id}
 *
 * @param id - ID de la vacación
 * @param enabled - Si la query está habilitada (opcional)
 *
 * @example
 * const { data, isLoading } = useVacacionQuery(vacacionId);
 * const vacacion = data?.datos;
 */
export const useVacacionQuery = (id: number, enabled: boolean = true) => {
  return useQuery<ResultDTO<ListarVacacionByIdDTO>>({
    queryKey: vacacionesKeys.detail(id),
    queryFn: () => vacacionesService.obtenerPorId(id),
    enabled: enabled && id > 0,
  });
};

/**
 * Hook para obtener vacaciones de un empleado específico
 * GET /api/v1/Vacaciones/empleado/{empleadoId}
 *
 * @param empleadoId - ID del empleado
 * @param enabled - Si la query está habilitada (opcional)
 *
 * @example
 * const { data, isLoading } = useVacacionesPorEmpleadoQuery(empleadoId);
 * const misVacaciones = data?.datos || [];
 */
export const useVacacionesPorEmpleadoQuery = (
  empleadoId: number,
  enabled: boolean = true,
) => {
  return useQuery<ResultDTO<ListarVacacionesDTO[]>>({
    queryKey: vacacionesKeys.byEmpleado(empleadoId),
    queryFn: () => vacacionesService.obtenerPorEmpleado(empleadoId),
    enabled: enabled && empleadoId > 0,
  });
};

/**
 * Hook para obtener vacaciones por estado
 * GET /api/v1/Vacaciones/estado/{estado}
 *
 * @param estado - Estado de las vacaciones (PENDIENTE, APROBADA, RECHAZADA, CANCELADA)
 * @param enabled - Si la query está habilitada (opcional)
 *
 * @example
 * const { data } = useVacacionesPorEstadoQuery("PENDIENTE");
 * const pendientes = data?.datos || [];
 */
export const useVacacionesPorEstadoQuery = (
  estado: string,
  enabled: boolean = true,
) => {
  return useQuery<ResultDTO<ListarVacacionesDTO[]>>({
    queryKey: vacacionesKeys.byEstado(estado),
    queryFn: () => vacacionesService.obtenerPorEstado(estado),
    enabled: enabled && estado.length > 0,
  });
};

/**
 * Hook para obtener el saldo de vacaciones de un empleado
 * GET /api/v1/Vacaciones/saldo/{empleadoId}?anio={anio}
 *
 * @param empleadoId - ID del empleado
 * @param anio - Año a consultar (opcional, por defecto año actual)
 * @param enabled - Si la query está habilitada (opcional)
 *
 * @example
 * const { data, isLoading } = useSaldoVacacionesQuery(empleadoId, 2026);
 * const diasDisponibles = data?.datos?.diasDisponibles || 0;
 */
export const useSaldoVacacionesQuery = (
  empleadoId: number,
  anio?: number,
  enabled: boolean = true,
) => {
  return useQuery<ResultDTO<SaldoVacacionesDTO>>({
    queryKey: vacacionesKeys.saldo(empleadoId, anio),
    queryFn: () => vacacionesService.obtenerSaldo(empleadoId, anio),
    enabled: enabled && empleadoId > 0,
    // Cachear por 5 minutos (el saldo no cambia tan frecuentemente)
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener el historial de saldos de un empleado
 * GET /api/v1/Vacaciones/saldo/{empleadoId}/historial
 *
 * @param empleadoId - ID del empleado
 * @param enabled - Si la query está habilitada (opcional)
 *
 * @example
 * const { data } = useHistorialSaldosQuery(empleadoId);
 * const historial = data?.datos || [];
 */
export const useHistorialSaldosQuery = (
  empleadoId: number,
  enabled: boolean = true,
) => {
  return useQuery<ResultDTO<SaldoVacacionesDTO[]>>({
    queryKey: vacacionesKeys.historialSaldo(empleadoId),
    queryFn: () => vacacionesService.obtenerHistorialSaldos(empleadoId),
    enabled: enabled && empleadoId > 0,
  });
};
