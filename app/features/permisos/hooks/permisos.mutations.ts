import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";

import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
} from "../types";
import { permisoKeys } from "../queries/permisos.queries";
import { permisoService } from "../services/permisos.service";

/**
 * Crear nuevo permiso
 */
export const useCreatePermisoMutation = (): UseMutationResult<
  Permiso,
  Error,
  CrearPermisoDTO
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permisoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creando permiso:", error.message);
    },
  });
};

/**
 * Actualizar permiso
 */
export const useUpdatePermisoMutation = (): UseMutationResult<
  Permiso,
  Error,
  { id: number; dto: ActualizarPermisoDTO }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }) => permisoService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: permisoKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
    onError: (error) => {
      console.error("Error actualizando permiso:", error.message);
    },
  });
};

/**
 * Eliminar permiso
 */
export const useDeletePermisoMutation = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permisoService.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: permisoKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
    onError: (error) => {
      console.error("Error eliminando permiso:", error.message);
    },
  });
};

/**
 * Aprobar o rechazar permiso
 */
export const useAprobarRechazarPermisoMutation = (): UseMutationResult<
  void,
  Error,
  { id: number; dto: AprobarRechazarPermisoDTO }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }) => permisoService.aprobarRechazar(id, dto),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: permisoKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },

    onError: (error) => {
      console.error("Error aprobando/rechazando permiso:", error.message);
    },
  });
};
