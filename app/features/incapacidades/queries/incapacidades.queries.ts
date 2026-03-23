import { useQuery } from "@tanstack/react-query";
import { Incapacidad } from "../types";
import incapacidadService from "../services/incapacidad.service";

export const useIncapacidadQuery = () => {
  return useQuery<Incapacidad[]>({
    queryKey: ["incapacidades"],
    queryFn: () => incapacidadService.ListarIncapacidades(),
  });
};
