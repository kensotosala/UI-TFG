import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";

import { toast } from "react-toastify";
import { CrearPermisoDTO } from "@/app/features/permisos/types";
import permisoService from "../services/PermisoEmpleadoService";

export const usePermisosEmpleado = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const permisosQuery = useQuery({
    queryKey: ["permisos-empleado", user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return [];
      return permisoService.getByEmpleado(user.employeeId);
    },
    enabled: !!user?.employeeId,
  });

  const crearPermisoMutation = useMutation({
    mutationFn: (data: CrearPermisoDTO) => permisoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos-empleado"] });
      toast.success("Solicitud de permiso enviada", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al solicitar permiso", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return {
    permisos: permisosQuery.data ?? [],
    isLoading: permisosQuery.isLoading,
    solicitar: crearPermisoMutation.mutate,
    isSolicitando: crearPermisoMutation.isPending,
  };
};
