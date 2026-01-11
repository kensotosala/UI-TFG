import { useQuery } from "@tanstack/react-query";
import { asistenciaService } from "../../auth/services/asistenciaService";

export const useAsistenciaQuery = () =>
  useQuery({
    queryKey: ["asistencia"],
    queryFn: asistenciaService.getAll,
  });
