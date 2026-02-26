import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";
import incapacidadService from "../services/incapacidad.services";
import { toast } from "react-toastify";
import { RegistrarIncapacidadDTO } from "../types";

export const useIncapacidadesEmpleado = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const incapacidadesQuery = useQuery({
    queryKey: ["incapacidades-empleado", user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return [];
      const todas = await incapacidadService.listarIncapacidades();
      return todas.filter((inc) => inc.empleadoId === user.employeeId);
    },
    enabled: !!user?.employeeId,
  });

  const registrarMutation = useMutation({
    mutationFn: (
      data: Omit<RegistrarIncapacidadDTO, "empleadoId"> & { archivo?: File },
    ) => {
      if (!user?.employeeId) {
        throw new Error("No hay empleado autenticado");
      }

      const { archivo, ...resto } = data;
      return incapacidadService.registrarIncapacidad(
        { ...resto, empleadoId: user.employeeId },
        archivo,
      );
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
    mutationFn: (id: number) => incapacidadService.eliminarIncapacidad(id),
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
