import { useQuery } from "@tanstack/react-query";
import { empleadoService } from "../services/empleados.service";
import { UsuarioDTO } from "../types";

export const useUsuariosAdmin = () => {
  const query = useQuery<UsuarioDTO[]>({
    queryKey: ["usuarios-admin"],
    queryFn: empleadoService.getUsuariosAdmin,
    staleTime: 1000 * 60 * 5, 
  });

  return {
    usuariosAdmin: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};