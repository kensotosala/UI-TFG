import { useQuery, useMutation } from "@tanstack/react-query";
import { liquidacionesQueries } from "../queries/liquidaciones.query";
import { useLiquidacionesMutations } from "./useLiquidacionesMutations";

export const useLiquidaciones = () => {
  const listarQuery = useQuery(liquidacionesQueries.listar());
  const crearMutation = useMutation(useLiquidacionesMutations().crear());

  return {
    liquidaciones: listarQuery.data?.datos ?? [],
    isLoading: listarQuery.isLoading,
    isError: listarQuery.isError,
    crear: crearMutation.mutate,
    isCreating: crearMutation.isPending,
  };
};
