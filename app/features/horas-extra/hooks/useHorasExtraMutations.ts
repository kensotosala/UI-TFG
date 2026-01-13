import { useMutation, useQueryClient } from "@tanstack/react-query";
import { horasExtraService } from "../services/horasExtra.service";
import {
  CrearHoraExtraDTO,
  ActualizarHoraExtraDTO,
  AprobarRechazarHoraExtraDTO,
} from "../types";
import { toast } from "react-toastify";
import { horasExtraKeys } from "../queries/horasExtra.queries";

export const useHorasExtraMutations = () => {
  const queryClient = useQueryClient();

  const createHoraExtra = useMutation({
    mutationFn: (data: CrearHoraExtraDTO) => horasExtraService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horasExtraKeys.all });
      toast.success("✅ Solicitud de horas extra creada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la solicitud", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const updateHoraExtra = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarHoraExtraDTO }) =>
      horasExtraService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horasExtraKeys.all });
      toast.success("✅ Solicitud actualizada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la solicitud", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const deleteHoraExtra = useMutation({
    mutationFn: (id: number) => horasExtraService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: horasExtraKeys.all });
      toast.success("✅ Solicitud eliminada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      const message = error.message.startsWith("❌")
        ? error.message
        : error.message;

      toast.error(message, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const aprobarRechazarHoraExtra = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: AprobarRechazarHoraExtraDTO;
    }) => horasExtraService.aprobarRechazar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: horasExtraKeys.all });
      const accion =
        variables.data.estadoSolicitud === "APROBADA"
          ? "aprobada"
          : "rechazada";
      toast.success(`✅ Solicitud ${accion} correctamente`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al procesar la solicitud", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return {
    createHoraExtra: createHoraExtra.mutateAsync,
    updateHoraExtra: updateHoraExtra.mutateAsync,
    deleteHoraExtra: deleteHoraExtra.mutateAsync,
    aprobarRechazarHoraExtra: aprobarRechazarHoraExtra.mutateAsync,
    isCreating: createHoraExtra.isPending,
    isUpdating: updateHoraExtra.isPending,
    isDeleting: deleteHoraExtra.isPending,
    isApproving: aprobarRechazarHoraExtra.isPending,
  };
};
