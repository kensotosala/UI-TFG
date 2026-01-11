import { usePuestosQuery } from "../queries/puestos.queries";

export const usePuestos = () => {
  const puestosQuery = usePuestosQuery();

  return {
    puestos: puestosQuery.data ?? [],
  };
};
