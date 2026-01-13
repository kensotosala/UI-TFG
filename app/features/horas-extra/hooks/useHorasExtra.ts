import { useHorasExtrasQuery } from "../queries/horasExtra.queries";
import { useHorasExtraMutations } from "./useHorasExtraMutations";

export const useHorasExtra = () => {
  const horasExtrasQuery = useHorasExtrasQuery();
  const mutations = useHorasExtraMutations();

  return {
    horasExtras: horasExtrasQuery.data ?? [],
    isLoading: horasExtrasQuery.isLoading,
    error: horasExtrasQuery.error,
    refetch: horasExtrasQuery.refetch,
    ...mutations,
  };
};
