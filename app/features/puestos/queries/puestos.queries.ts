import { useQuery } from "@tanstack/react-query";
import { puestoService } from "../services/puestos.service";
import { Puesto } from "../types";

export const usePuestosQuery = () => {
  return useQuery<Puesto[]>({
    queryKey: ["puestos"],
    queryFn: () => puestoService.getAll(),
  });
};
