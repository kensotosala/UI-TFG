import {
  MetricasRendimientoDTO,
  ResultDTO,
} from "@/app/features/evaluaciones-rendimiento/types";
import { useQuery } from "@tanstack/react-query";

const fetchMetricas = async (): Promise<MetricasRendimientoDTO[]> => {
  const response = await fetch(
    "https://localhost:7121/api/v1/MetricasRendimiento",
    {
      headers: { accept: "*/*" },
    },
  );

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result: ResultDTO<MetricasRendimientoDTO[]> = await response.json();

  if (!result.exitoso) {
    throw new Error(result.mensaje || "Error al obtener métricas");
  }

  return result.datos;
};

export const useMetricasRendimiento = () => {
  return useQuery<MetricasRendimientoDTO[], Error>({
    queryKey: ["metricasRendimiento"],
    queryFn: fetchMetricas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
