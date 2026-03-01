import { useQueryClient } from "@tanstack/react-query";
import { liquidacionesService } from "../services/liquidaciones.service";
import { liquidacionesKeys } from "../liquidaciones.keys";
import { CrearLiquidacionDTO } from "../types";

export const useLiquidacionesMutations = () => {
  const queryClient = useQueryClient();

  return {
    crear: () => ({
      mutationFn: (payload: CrearLiquidacionDTO) =>
        liquidacionesService.crear(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: liquidacionesKeys.lists(),
        });
      },
    }),
  };
};
