import { useQueryClient } from "@tanstack/react-query";
import { liquidacionesService } from "../services/liquidaciones.service";
import { liquidacionesKeys } from "../liquidaciones.keys";
import { CrearLiquidacionDTO } from "../types";
import { toast } from "sonner";

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
        toast.success("Liquidación registrada correctamente", {
          position: "top-center",
          duration: 3000,
        });
      },
    }),
    anular: () => ({
      mutationFn: (id: number) => liquidacionesService.anular(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: liquidacionesKeys.lists() });
        toast.success("Liquidación anulada correctamente", {
          position: "top-center",
          duration: 3000,
        });
      },
    }),
  };
};
