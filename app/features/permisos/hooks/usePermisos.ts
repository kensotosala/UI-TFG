import {
  usePermisosQuery,
  usePermisoQuery,
  usePermisosByEmpleadoQuery,
  usePermisosPendientesJefeQuery,
} from "../queries/permisos.queries";

import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
} from "../types";

import {
  useAprobarRechazarPermisoMutation,
  useCreatePermisoMutation,
  useDeletePermisoMutation,
  useUpdatePermisoMutation,
} from "./permisos.mutations";

/**
 * Hook principal
 */
export const usePermisos = () => {
  // Queries
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosQuery();

  // Mutations
  const createMutation = useCreatePermisoMutation();
  const updateMutation = useUpdatePermisoMutation();
  const deleteMutation = useDeletePermisoMutation();
  const aprobarRechazarMutation = useAprobarRechazarPermisoMutation();

  // Actions
  const createPermiso = (dto: CrearPermisoDTO): Promise<Permiso> =>
    createMutation.mutateAsync(dto);

  const updatePermiso = ({
    id,
    dto,
  }: {
    id: number;
    dto: ActualizarPermisoDTO;
  }): Promise<Permiso> => updateMutation.mutateAsync({ id, dto });

  const deletePermiso = (id: number): Promise<void> =>
    deleteMutation.mutateAsync(id);

  const aprobarRechazarPermiso = ({
    id,
    dto,
  }: {
    id: number;
    dto: AprobarRechazarPermisoDTO;
  }): Promise<{ mensaje?: string }> =>
    // ✅ FIX tipo
    aprobarRechazarMutation.mutateAsync({ id, dto });

  return {
    // Data
    permisos,
    isLoading,
    isError,
    error,

    // Actions
    refetch,
    createPermiso,
    updatePermiso,
    deletePermiso,
    aprobarRechazarPermiso,

    // States
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAprobandoRechazando: aprobarRechazarMutation.isPending,
  };
};

/**
 * Obtener uno
 */
export const usePermiso = (id: number) => {
  const { data: permiso, isLoading, isError, error } = usePermisoQuery(id);

  return {
    permiso,
    isLoading,
    isError,
    error,
  };
};

/**
 * Por empleado
 */
export const usePermisosByEmpleado = (empleadoId: number) => {
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosByEmpleadoQuery(empleadoId);

  return {
    permisos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Pendientes por jefe
 */
export const usePermisosPendientesJefe = (jefeId: number) => {
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosPendientesJefeQuery(jefeId);

  return {
    permisos,
    isLoading,
    isError,
    error,
    refetch,
  };
};
