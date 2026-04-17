import {
  MetricasRendimientoDTO,
  ResultDTO,
} from "@/app/features/evaluaciones-rendimiento/types";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios-config";

/**
 * Fetch usando axios centralizado
 */
const fetchMetricas = async (): Promise<MetricasRendimientoDTO[]> => {
  const { data } = await api.get<ResultDTO<MetricasRendimientoDTO[]>>(
    "/MetricasRendimiento",
  );

  if (!data.exitoso) {
    throw new Error(data.mensaje || "Error al obtener métricas");
  }

  return data.datos;
};

/**
 * Hook
 */
export const useMetricasRendimiento = () => {
  return useQuery<MetricasRendimientoDTO[], Error>({
    queryKey: ["metricasRendimiento"],
    queryFn: fetchMetricas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
