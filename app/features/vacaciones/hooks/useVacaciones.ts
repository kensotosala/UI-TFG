import { useVacacionesQuery } from "../queries/vacaciones.queries";
import {
  useCrearVacacionMutation,
  useActualizarVacacionMutation,
  useCancelarVacacionMutation,
  useAprobarVacacionMutation,
  useRechazarVacacionMutation,
  useRecalcularSaldoMutation,
  useValidarVacacionMutation,
} from "./useVacacionesMutations";

export const useVacaciones = () => {
  // Query principal (obtener todas las vacaciones)
  const vacacionesQuery = useVacacionesQuery();

  // Mutations
  const crearMutation = useCrearVacacionMutation();
  const actualizarMutation = useActualizarVacacionMutation();
  const cancelarMutation = useCancelarVacacionMutation();
  const aprobarMutation = useAprobarVacacionMutation();
  const rechazarMutation = useRechazarVacacionMutation();
  const recalcularSaldoMutation = useRecalcularSaldoMutation();
  const validarMutation = useValidarVacacionMutation();

  return {
    // ========================================
    // DATOS Y ESTADOS DE LA QUERY
    // ========================================

    /**
     * Lista de todas las vacaciones
     * @type {ListarVacacionesDTO[]}
     */
    vacaciones: vacacionesQuery.data?.datos ?? [],

    /**
     * Resultado completo de la API (incluye mensaje, errores, etc.)
     */
    resultado: vacacionesQuery.data,

    /**
     * Indica si está cargando
     */
    isLoading: vacacionesQuery.isLoading,

    /**
     * Indica si hubo un error
     */
    isError: vacacionesQuery.isError,

    /**
     * Objeto de error si lo hay
     */
    error: vacacionesQuery.error,

    /**
     * Función para refrescar los datos
     */
    refetch: vacacionesQuery.refetch,

    // ========================================
    // MUTATIONS (OPERACIONES)
    // ========================================

    /**
     * Crear una nueva solicitud de vacaciones
     * @example
     * crear.mutate({
     *   empleadoId: 5,
     *   fechaInicio: "2026-02-10",
     *   fechaFin: "2026-02-17"
     * });
     */
    crear: {
      mutate: crearMutation.mutate,
      mutateAsync: crearMutation.mutateAsync,
      isPending: crearMutation.isPending,
      isError: crearMutation.isError,
      isSuccess: crearMutation.isSuccess,
      error: crearMutation.error,
      data: crearMutation.data,
      reset: crearMutation.reset,
    },

    /**
     * Actualizar una solicitud existente
     * @example
     * actualizar.mutate({
     *   id: 1,
     *   dto: { empleadoId: 5, fechaInicio: "2026-02-15", fechaFin: "2026-02-22" }
     * });
     */
    actualizar: {
      mutate: actualizarMutation.mutate,
      mutateAsync: actualizarMutation.mutateAsync,
      isPending: actualizarMutation.isPending,
      isError: actualizarMutation.isError,
      isSuccess: actualizarMutation.isSuccess,
      error: actualizarMutation.error,
      data: actualizarMutation.data,
      reset: actualizarMutation.reset,
    },

    /**
     * Cancelar una solicitud de vacaciones
     * @example
     * cancelar.mutate(vacacionId);
     */
    cancelar: {
      mutate: cancelarMutation.mutate,
      mutateAsync: cancelarMutation.mutateAsync,
      isPending: cancelarMutation.isPending,
      isError: cancelarMutation.isError,
      isSuccess: cancelarMutation.isSuccess,
      error: cancelarMutation.error,
      data: cancelarMutation.data,
      reset: cancelarMutation.reset,
    },

    /**
     * Aprobar una solicitud de vacaciones
     * @example
     * aprobar.mutate({ id: 1, jefeId: 3 });
     */
    aprobar: {
      mutate: aprobarMutation.mutate,
      mutateAsync: aprobarMutation.mutateAsync,
      isPending: aprobarMutation.isPending,
      isError: aprobarMutation.isError,
      isSuccess: aprobarMutation.isSuccess,
      error: aprobarMutation.error,
      data: aprobarMutation.data,
      reset: aprobarMutation.reset,
    },

    /**
     * Rechazar una solicitud de vacaciones
     * @example
     * rechazar.mutate({
     *   id: 1,
     *   request: { jefeId: 3, comentarios: "No hay cobertura" }
     * });
     */
    rechazar: {
      mutate: rechazarMutation.mutate,
      mutateAsync: rechazarMutation.mutateAsync,
      isPending: rechazarMutation.isPending,
      isError: rechazarMutation.isError,
      isSuccess: rechazarMutation.isSuccess,
      error: rechazarMutation.error,
      data: rechazarMutation.data,
      reset: rechazarMutation.reset,
    },

    /**
     * Recalcular el saldo de vacaciones
     * @example
     * recalcularSaldo.mutate({ empleadoId: 5, anio: 2026 });
     */
    recalcularSaldo: {
      mutate: recalcularSaldoMutation.mutate,
      mutateAsync: recalcularSaldoMutation.mutateAsync,
      isPending: recalcularSaldoMutation.isPending,
      isError: recalcularSaldoMutation.isError,
      isSuccess: recalcularSaldoMutation.isSuccess,
      error: recalcularSaldoMutation.error,
      data: recalcularSaldoMutation.data,
      reset: recalcularSaldoMutation.reset,
    },

    /**
     * Validar una solicitud sin crearla
     * @example
     * validar.mutate({
     *   empleadoId: 5,
     *   fechaInicio: "2026-03-01",
     *   fechaFin: "2026-03-07"
     * });
     */
    validar: {
      mutate: validarMutation.mutate,
      mutateAsync: validarMutation.mutateAsync,
      isPending: validarMutation.isPending,
      isError: validarMutation.isError,
      isSuccess: validarMutation.isSuccess,
      error: validarMutation.error,
      data: validarMutation.data,
      reset: validarMutation.reset,
    },
  };
};

/**
 * Re-exportar hooks individuales para uso específico
 */
export {
  // Queries
  useVacacionesQuery,
  useVacacionQuery,
  useVacacionesPorEmpleadoQuery,
  useVacacionesPorEstadoQuery,
  useSaldoVacacionesQuery,
  useHistorialSaldosQuery,
  vacacionesKeys,
} from "../queries/vacaciones.queries";

export {
  // Mutations
  useCrearVacacionMutation,
  useActualizarVacacionMutation,
  useCancelarVacacionMutation,
  useAprobarVacacionMutation,
  useRechazarVacacionMutation,
  useRecalcularSaldoMutation,
  useValidarVacacionMutation,
} from "./useVacacionesMutations";
