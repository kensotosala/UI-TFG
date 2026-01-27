import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CrearVacacionDTO,
  ActualizarVacacionDTO,
  ListarVacacionByIdDTO,
  SaldoVacacionesDTO,
  ValidacionVacacionesDTO,
  RechazarVacacionRequest,
  ValidarVacacionRequest,
  ResultDTO,
} from "../vacaciones.types";
import vacacionesService from "../services/vacaciones.service";
import { vacacionesKeys } from "../queries/vacaciones.queries";
import { toast } from "react-toastify";

// ========================================
// MUTATION HOOKS (Escrituras - POST, PUT, DELETE, PATCH)
// ========================================

/**
 * Hook para crear una nueva solicitud de vacaciones
 * POST /api/v1/Vacaciones
 *
 * @example
 * const { mutate, isPending } = useCrearVacacionMutation();
 *
 * mutate({
 *   empleadoId: 5,
 *   fechaInicio: "2026-02-10",
 *   fechaFin: "2026-02-17"
 * }, {
 *   onSuccess: (data) => {
 *     console.log("Creado:", data);
 *   }
 * });
 */
export const useCrearVacacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultDTO<ListarVacacionByIdDTO>, Error, CrearVacacionDTO>(
    {
      mutationFn: (dto: CrearVacacionDTO) =>
        vacacionesService.crearSolicitud(dto),

      onSuccess: (data) => {
        // Invalidar cache para refrescar listas
        queryClient.invalidateQueries({ queryKey: vacacionesKeys.lists() });
        queryClient.invalidateQueries({ queryKey: vacacionesKeys.all });

        // Si retornó datos del empleado, invalidar sus vacaciones y saldo
        if (data.datos?.empleadoId) {
          queryClient.invalidateQueries({
            queryKey: vacacionesKeys.byEmpleado(data.datos.empleadoId),
          });
          queryClient.invalidateQueries({
            queryKey: vacacionesKeys.saldo(data.datos.empleadoId),
          });
        }

        // Mostrar toast de éxito
        if (data.exitoso) {
          toast.success("Solicitud creada", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },

      onError: (error: Error) => {
        toast.error("Error al crear solicitud" + error, {
          position: "top-right",
          autoClose: 4000,
        });
      },
    },
  );
};

/**
 * Hook para actualizar una solicitud de vacaciones
 * PUT /api/v1/Vacaciones/{id}
 *
 * @example
 * const { mutate } = useActualizarVacacionMutation();
 *
 * mutate({
 *   id: 1,
 *   dto: {
 *     empleadoId: 5,
 *     fechaInicio: "2026-02-15",
 *     fechaFin: "2026-02-22"
 *   }
 * });
 */
export const useActualizarVacacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResultDTO<boolean>,
    Error,
    { id: number; dto: ActualizarVacacionDTO }
  >({
    mutationFn: ({ id, dto }) => vacacionesService.actualizarSolicitud(id, dto),

    onSuccess: (data, variables) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: vacacionesKeys.all });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.detail(variables.id),
      });

      if (data.exitoso) {
        toast.success("Solicitud actualizada", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },

    onError: (error: Error) => {
      toast.error("Error al actualizar" + error, {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

/**
 * Hook para cancelar una solicitud de vacaciones
 * DELETE /api/v1/Vacaciones/{id}
 *
 * @example
 * const { mutate, isPending } = useCancelarVacacionMutation();
 *
 * mutate(vacacionId, {
 *   onSuccess: () => {
 *     navigate("/vacaciones");
 *   }
 * });
 */
export const useCancelarVacacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultDTO<boolean>, Error, number>({
    mutationFn: (id: number) => vacacionesService.cancelarSolicitud(id),

    onSuccess: (data, id) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: vacacionesKeys.all });
      queryClient.invalidateQueries({ queryKey: vacacionesKeys.detail(id) });

      if (data.exitoso) {
        toast.success("Solicitud cancelada", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },

    onError: (error: Error) => {
      toast.error("Error al cancelar" + error, {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

/**
 * Hook para aprobar una solicitud de vacaciones
 * PATCH /api/v1/Vacaciones/{id}/aprobar?jefeId={jefeId}
 *
 * @example
 * const { mutate } = useAprobarVacacionMutation();
 *
 * mutate({
 *   id: 1,
 *   jefeId: 3
 * });
 */
export const useAprobarVacacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultDTO<boolean>, Error, { id: number; jefeId: number }>(
    {
      mutationFn: ({ id, jefeId }) =>
        vacacionesService.aprobarSolicitud(id, jefeId),

      onSuccess: (data, variables) => {
        // Invalidar cache
        queryClient.invalidateQueries({ queryKey: vacacionesKeys.all });
        queryClient.invalidateQueries({
          queryKey: vacacionesKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: vacacionesKeys.byEstado("PENDIENTE"),
        });
        queryClient.invalidateQueries({
          queryKey: vacacionesKeys.byEstado("APROBADA"),
        });

        if (data.exitoso) {
          toast.success("Solicitud aprobada", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },

      onError: (error: Error) => {
        toast.error("Error al aprobar" + error, {
          position: "top-right",
          autoClose: 4000,
        });
      },
    },
  );
};

/**
 * Hook para rechazar una solicitud de vacaciones
 * PATCH /api/v1/Vacaciones/{id}/rechazar
 *
 * @example
 * const { mutate } = useRechazarVacacionMutation();
 *
 * mutate({
 *   id: 1,
 *   request: {
 *     jefeId: 3,
 *     comentarios: "No hay cobertura suficiente"
 *   }
 * });
 */
export const useRechazarVacacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResultDTO<boolean>,
    Error,
    { id: number; request: RechazarVacacionRequest }
  >({
    mutationFn: ({ id, request }) =>
      vacacionesService.rechazarSolicitud(id, request),

    onSuccess: (data, variables) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: vacacionesKeys.all });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.byEstado("PENDIENTE"),
      });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.byEstado("RECHAZADA"),
      });

      if (data.exitoso) {
        toast.success("Solicitud rechazada", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },

    onError: (error: Error) => {
      toast.error("Error al rechazar" + error, {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

/**
 * Hook para recalcular el saldo de vacaciones
 * POST /api/v1/Vacaciones/saldo/{empleadoId}/recalcular?anio={anio}
 *
 * @example
 * const { mutate } = useRecalcularSaldoMutation();
 *
 * mutate({
 *   empleadoId: 5,
 *   anio: 2026
 * });
 */
export const useRecalcularSaldoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResultDTO<SaldoVacacionesDTO>,
    Error,
    { empleadoId: number; anio: number }
  >({
    mutationFn: ({ empleadoId, anio }) =>
      vacacionesService.recalcularSaldo(empleadoId, anio),

    onSuccess: (data, variables) => {
      // Invalidar cache de saldos
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.saldo(variables.empleadoId),
      });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.historialSaldo(variables.empleadoId),
      });

      if (data.exitoso) {
        toast.success("Saldo recalculado", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    },

    onError: (error: Error) => {
      toast.error("Error al recalcular saldo" + error, {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

/**
 * Hook para validar una solicitud sin crearla
 * POST /api/v1/Vacaciones/validar
 *
 * Útil para mostrar errores en tiempo real en formularios
 *
 * @example
 * const { mutate, data } = useValidarVacacionMutation();
 *
 * mutate({
 *   empleadoId: 5,
 *   fechaInicio: "2026-03-01",
 *   fechaFin: "2026-03-07"
 * }, {
 *   onSuccess: (result) => {
 *     if (!result.datos?.esValida) {
 *       console.log("Errores:", result.datos?.errores);
 *     }
 *   }
 * });
 */

export const useValidarVacacionMutation = () => {
  return useMutation<
    ResultDTO<ValidacionVacacionesDTO>,
    Error,
    ValidarVacacionRequest
  >({
    mutationFn: (request: ValidarVacacionRequest) =>
      vacacionesService.validarSolicitud(request),

    onSuccess: (data) => {
      const advertencias = data.datos?.advertencias;

      if (advertencias && advertencias.length > 0) {
        toast.warning("Advertencias", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    },

    onError: () => {},
  });
};
