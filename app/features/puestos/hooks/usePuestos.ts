
import { usePuestoMutations } from "./usePuestoMutation";

export const usePuestos = () => {
  const puestosQuery = usePuestosQuery();
  const mutations = usePuestoMutations();

  return {
    puestos: puestosQuery.data ?? [],
    isLoading: puestosQuery.isLoading,
    refetch: puestosQuery.refetch,
    ...mutations,
  };
};
