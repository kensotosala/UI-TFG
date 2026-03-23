import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { toast } from "react-toastify";
import { RegistrarIncapacidadDTO } from "@/app/features/incapacidades/types";
import incapacidadService from "@/app/features/incapacidades/services/incapacidad.service";

export const useIncapacidadesEmpleado = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const incapacidadesQuery = useQuery({
    queryKey: ["incapacidades-empleado", user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return [];
      return incapacidadService.ListarPorEmpleado(user.employeeId);
    },
    enabled: !!user?.employeeId,
  });

  const registrarMutation = useMutation({
    mutationFn: (data: Omit<RegistrarIncapacidadDTO, "empleadoId">) => {
      if (!user?.employeeId) {
        throw new Error("No hay empleado autenticado");
      }
      return incapacidadService.RegistrarIncapacidad({
        ...data,
        empleadoId: user.employeeId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incapacidades-empleado", user?.employeeId],
      });
      toast.success("Incapacidad registrada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar incapacidad");
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => incapacidadService.EliminarIncapacidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incapacidades-empleado", user?.employeeId],
      });
      toast.success("Incapacidad eliminada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar");
    },
  });

  return {
    incapacidades: incapacidadesQuery.data ?? [],
    isLoading: incapacidadesQuery.isLoading,
    registrar: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
    eliminar: eliminarMutation.mutateAsync,
    isEliminando: eliminarMutation.isPending,
  };
};
