import { useAsistenciasQuery } from "../queries/asistencia.queries";
import { FiltrosAsistencia } from "../types";
import { useAsistenciaMutations } from "./useAsistenciaMutations";

export const useAsistencias = (filtros?: FiltrosAsistencia) => {
  const asistenciasQuery = useAsistenciasQuery(filtros);
  const mutations = useAsistenciaMutations();

  return {
    asistencias: asistenciasQuery.data?.data ?? [],
    total: asistenciasQuery.data?.total ?? 0,
    page: asistenciasQuery.data?.page ?? 1,
    totalPages: asistenciasQuery.data?.totalPages ?? 1,
    isLoading: asistenciasQuery.isLoading,
    error: asistenciasQuery.error,
    refetch: asistenciasQuery.refetch,
    ...mutations,
  };
};
