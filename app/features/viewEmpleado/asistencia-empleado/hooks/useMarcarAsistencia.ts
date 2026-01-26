import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/providers/AuthProvider";

import { toast } from "react-toastify";
import asistenciaService from "../services/asistencia.empleado.service";

interface MarcarResponse {
  exito: boolean;
  mensaje: string;
  accion: string;
  hora: string;
  estado: string;
  horaEntrada?: string;
  horaSalida?: string;
  puedeMarcarEntrada: boolean;
  puedeMarcarSalida: boolean;
}

export const useMarcarAsistencia = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const estadoQuery = useQuery({
    queryKey: ["asistencia-estado", user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return null;
      const response = await asistenciaService.getEstado(user.employeeId);
      return response;
    },
    enabled: !!user?.employeeId,
    refetchInterval: 30000,
  });

  const marcarMutation = useMutation({
    mutationFn: async () => {
      if (!user?.employeeId) throw new Error("No hay empleado autenticado");
      return asistenciaService.marcar(user.employeeId);
    },
    onSuccess: (data: MarcarResponse) => {
      queryClient.invalidateQueries({ queryKey: ["asistencia-estado"] });
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      toast.success(data.mensaje, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al marcar asistencia", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return {
    estado: estadoQuery.data,
    isLoading: estadoQuery.isLoading,
    marcar: marcarMutation.mutate,
    isMarking: marcarMutation.isPending,
  };
};
