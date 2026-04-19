import { useQuery } from "@tanstack/react-query";
import { Empleado, UsuarioDTO } from "../types";
import { empleadoService } from "../services/empleados.service";

export const useEmpleadosQuery = () => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: empleadoService.getAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useEmpleadosSinHorasExtraEnProcesoQuery = () => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados-sin-horas-extra-en-proceso"],
    queryFn: empleadoService.getEmpleadosSinHorasExtraEnProceso,
    staleTime: 1000 * 1,
    retry: 1,
  });
};

export const useUsuariosAdminQuery = () => {
  return useQuery<UsuarioDTO[]>({
    queryKey: ["usuarios-admin"],
    queryFn: empleadoService.getUsuariosAdmin,
    staleTime: 1000 * 60 * 5,
  });
};
