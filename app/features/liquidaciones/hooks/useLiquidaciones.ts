import { useQuery, useMutation } from "@tanstack/react-query";
import { useLiquidacionesMutations } from "./useLiquidacionesMutations";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { LiquidacionDTO } from "../types";
import { liquidacionesKeys } from "../liquidaciones.keys";
import { liquidacionesService } from "../services/liquidaciones.service";

export const useLiquidaciones = () => {
  const mutations = useLiquidacionesMutations();
  const crearMutation = useMutation(mutations.crear());
  const anularMutation = useMutation(mutations.anular());
  const editarMutation = useMutation(mutations.editar());

  const { user, checkRole } = useAuthContext();

  const userId = checkRole("EMPLEADO") ? user?.employeeId : undefined;

  const query = useQuery({
    queryKey: userId
      ? liquidacionesKeys.detail(userId)
      : liquidacionesKeys.lists(),
    queryFn: () =>
      userId
        ? liquidacionesService.listarPorEmpleado(userId)
        : liquidacionesService.listar(),
    select: (res) => res.datos as LiquidacionDTO[],
    staleTime: 1000 * 60 * 5,
  });

  return {
    liquidaciones: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    crear: crearMutation.mutateAsync,
    isCreating: crearMutation.isPending,
    editar: editarMutation.mutateAsync,
    isEditando: editarMutation.isPending,
    anular: anularMutation.mutateAsync,
    isAnulando: anularMutation.isPending,
    refetch: query.refetch,
  };
};
