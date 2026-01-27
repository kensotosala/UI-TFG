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
      const todas = await incapacidadService.ListarIncapacidades();
      return todas.filter((inc) => inc.empleadoId === user.employeeId);
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
      toast.success("Incapacidad registrada", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar incapacidad", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => incapacidadService.EliminarIncapacidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incapacidades-empleado", user?.employeeId],
      });
      toast.success("Incapacidad eliminada", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar", {
        position: "top-right",
        autoClose: 4000,
      });
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
