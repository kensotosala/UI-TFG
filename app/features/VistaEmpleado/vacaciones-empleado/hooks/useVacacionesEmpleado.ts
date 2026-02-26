import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";
import vacacionesService from "../services/vacaciones.service";
import { vacacionesKeys } from "../queries/vacaciones.queries";
import { toast } from "react-toastify";
import { CrearVacacionDTO } from "../vacaciones.types";

export const useVacacionesEmpleado = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const vacacionesQuery = useQuery({
    queryKey: vacacionesKeys.byEmpleado(user?.employeeId || 0),
    queryFn: async () => {
      if (!user?.employeeId) return { datos: [], exitoso: false };
      return vacacionesService.obtenerPorEmpleado(user.employeeId);
    },
    enabled: !!user?.employeeId,
  });

  const saldoQuery = useQuery({
    queryKey: vacacionesKeys.saldo(
      user?.employeeId || 0,
      new Date().getFullYear(),
    ),
    queryFn: async () => {
      if (!user?.employeeId) return { datos: null, exitoso: false };
      return vacacionesService.obtenerSaldo(
        user.employeeId,
        new Date().getFullYear(),
      );
    },
    enabled: !!user?.employeeId,
  });

  const crearMutation = useMutation({
    mutationFn: (data: Omit<CrearVacacionDTO, "empleadoId">) => {
      if (!user?.employeeId) {
        throw new Error("No hay empleado autenticado");
      }
      return vacacionesService.crearSolicitud({
        ...data,
        empleadoId: user.employeeId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.byEmpleado(user?.employeeId || 0),
      });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.saldo(user?.employeeId || 0),
      });
      toast.success("Solicitud de vacaciones creada", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear solicitud", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: number) => vacacionesService.cancelarSolicitud(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.byEmpleado(user?.employeeId || 0),
      });
      queryClient.invalidateQueries({
        queryKey: vacacionesKeys.saldo(user?.employeeId || 0),
      });
      toast.success("Solicitud cancelada", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cancelar solicitud", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return {
    vacaciones: vacacionesQuery.data?.datos ?? [],
    isLoading: vacacionesQuery.isLoading,
    saldo: saldoQuery.data?.datos ?? null,
    isSaldoLoading: saldoQuery.isLoading,
    solicitar: crearMutation.mutateAsync,
    isSolicitando: crearMutation.isPending,
    cancelar: cancelarMutation.mutateAsync,
    isCancelando: cancelarMutation.isPending,
  };
};
