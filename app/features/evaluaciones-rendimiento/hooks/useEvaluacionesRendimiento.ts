"use client";

import { useQuery } from "@tanstack/react-query";
import {
  evaluacionesRendimientoKeys,
  fetchEvaluacionRendimientoById,
  fetchEvaluacionesRendimiento,
} from "../queries/evaluaciones-rendimiento.queries";

/**
 * Hook para obtener la lista completa de evaluaciones.
 * Mantiene los datos en caché con staleTime de 1 minuto.
 */
export function useEvaluacionesRendimiento() {
  return useQuery({
    queryKey: evaluacionesRendimientoKeys.lists(),
    queryFn: fetchEvaluacionesRendimiento,
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Hook para obtener una evaluación por ID.
 * Solo ejecuta la query si el ID es válido (> 0).
 */
export function useEvaluacionRendimiento(id: number | null) {
  return useQuery({
    queryKey: evaluacionesRendimientoKeys.detail(id ?? 0),
    queryFn: () => fetchEvaluacionRendimientoById(id!),
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60,
  });
}
