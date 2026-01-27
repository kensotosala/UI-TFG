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
    mutationFn: (data: RegistrarIncapacidadDTO) =>
      incapacidadService.RegistrarIncapacidad(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad registrada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar incapacidad", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  /**
   * Mutación para actualizar una incapacidad
   */
  const actualizarIncapacidad = useMutation({
    mutationFn: (dto: ActualizarIncapacidadDTO) =>
      incapacidadService.ActualizarIncapacidad(dto.incapacidadId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad actualizada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la incapacidad", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  /**
   * Eliminar Incapacidad
   */
  const eliminarIncapacidad = useMutation({
    mutationFn: (id: number) => incapacidadService.EliminarIncapacidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incapacidades"] });
      toast.success("Incapacidad eliminada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar incapacidad", {
        position: "top-right",
        autoClose: 4000,
      });
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
