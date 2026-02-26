import { useAuthContext } from "@/components/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import asistenciaService from "../services/asistencia.empleado.service";
import { asistenciaKeys } from "../queries/asistencia.empleado.queries";

export const useAsistenciasEmpleado = () => {
  const { user } = useAuthContext();

  const asistenciasQuery = useQuery({
    queryKey: asistenciaKeys.empleado(user?.employeeId?.toString() || ""),
    queryFn: () =>
      asistenciaService.getByEmpleado(user?.employeeId?.toString() || ""),
    enabled: !!user?.employeeId,
  });

  return {
    asistencias: asistenciasQuery.data ?? [],
    isLoading: asistenciasQuery.isLoading,
    error: asistenciasQuery.error,
    refetch: asistenciasQuery.refetch,
  };
};
