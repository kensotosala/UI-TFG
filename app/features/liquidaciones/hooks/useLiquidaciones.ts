import { useQuery, useMutation } from "@tanstack/react-query";
import { liquidacionesQueries } from "../queries/liquidaciones.query";
import { useLiquidacionesMutations } from "./useLiquidacionesMutations";

export const useLiquidaciones = () => {
  const listarQuery = useQuery(liquidacionesQueries.listar());
  const mutations = useLiquidacionesMutations();
  const crearMutation = useMutation(mutations.crear());
  const anularMutation = useMutation(mutations.anular());

  return {
    liquidaciones: listarQuery.data?.datos ?? [],
    isLoading: listarQuery.isLoading,
    isError: listarQuery.isError,
    crear: crearMutation.mutateAsync,
    isCreating: crearMutation.isPending,
    anular: anularMutation.mutateAsync,
    isAnulando: anularMutation.isPending,
    refetch: listarQuery.refetch,
  };
};
