import {
  useEmpleadosQuery,
  useEmpleadosSinHorasExtraEnProcesoQuery,
} from "../queries/empleados.queries";
import { useEmpleadoMutations } from "./useEmpleadosMutation";

export const useEmpleados = () => {
  const empleadosQuery = useEmpleadosQuery();
  const empleadosSinHorasExtraEnProcesoQuery =
    useEmpleadosSinHorasExtraEnProcesoQuery();
  const mutations = useEmpleadoMutations();

  return {
    empleados: empleadosQuery.data ?? [],
    isLoading: empleadosQuery.isLoading,
    refetch: empleadosQuery.refetch,
    empleadosSinHorasExtraEnProceso:
      empleadosSinHorasExtraEnProcesoQuery.data ?? [],
    isLoadingSinHorasExtraEnProceso:
      empleadosSinHorasExtraEnProcesoQuery.isLoading,
    refetchSinHorasExtraEnProceso: empleadosSinHorasExtraEnProcesoQuery.refetch,
    ...mutations,
  };
};
