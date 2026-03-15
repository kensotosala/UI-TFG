import { queryOptions } from "@tanstack/react-query";
import { liquidacionesService } from "../services/liquidaciones.service";
import { liquidacionesKeys } from "../liquidaciones.keys";

export const liquidacionesQueries = {
  listar: () =>
    queryOptions({
      queryKey: liquidacionesKeys.lists(),
      queryFn: () => liquidacionesService.listar(),
      staleTime: 1000 * 60 * 5,
    }),

  listarPorEmpleado: (idEmpleado: number) =>
    queryOptions({
      queryKey: liquidacionesKeys.detail(idEmpleado),
      queryFn: () => liquidacionesService.listarPorEmpleado(idEmpleado),
      staleTime: 1000 * 60 * 5,
    }),

  detalle: (id: number) =>
    queryOptions({
      queryKey: liquidacionesKeys.detail(id),
      queryFn: () => liquidacionesService.obtenerPorId(id),
      enabled: !!id,
    }),
};
