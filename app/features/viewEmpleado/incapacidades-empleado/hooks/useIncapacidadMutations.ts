import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActualizarIncapacidadDTO, RegistrarIncapacidadDTO } from "../types";
import incapacidadService from "../services/incapacidad.services";
import { toast } from "react-toastify";

export const useIncapacidadMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutación para registrar una nueva incapacidad
   */
  const registrarIncapacidad = useMutation({
    mutationFn: (data: RegistrarIncapacidadDTO & { archivo?: File }) => {
      const { archivo, ...dto } = data;
      return incapacidadService.registrarIncapacidad(dto, archivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad registrada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar incapacidad");
    },
  });

  /**
   * Mutación para actualizar una incapacidad
   */
  const actualizarIncapacidad = useMutation({
    mutationFn: (dto: ActualizarIncapacidadDTO) =>
      incapacidadService.actualizarIncapacidad(dto.incapacidadId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la incapacidad");
    },
  });

  /**
   * Eliminar Incapacidad
   */
  const eliminarIncapacidad = useMutation({
    mutationFn: (id: number) => incapacidadService.eliminarIncapacidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar incapacidad");
    },
  });

  return {
    registrarIncapacidad: registrarIncapacidad.mutateAsync,
    actualizarIncapacidad: actualizarIncapacidad.mutateAsync,
    eliminarIncapacidad: eliminarIncapacidad.mutateAsync,
    isCreating: registrarIncapacidad.isPending,
    isUpdating: actualizarIncapacidad.isPending,
    isDeleting: eliminarIncapacidad.isPending,
  };
};
