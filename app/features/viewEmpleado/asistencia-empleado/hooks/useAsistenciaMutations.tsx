// hooks/useAsistenciaMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CrearAsistenciaDTO,
  ActualizarAsistenciaDTO,
  RegistroAsistencia,
  EstadoAsistencia,
} from "../types";

import { toast } from "react-toastify";
import asistenciaService from "../services/asistencia.empleado.service";
import { asistenciaKeys } from "../queries/asistencia.empleado.queries";

export const useAsistenciaMutations = () => {
  const queryClient = useQueryClient();

  const crearAsistencia = useMutation({
    mutationFn: (data: CrearAsistenciaDTO) => {
      console.log("🚀 useAsistenciaMutations - Creando asistencia:", data);
      return asistenciaService.create(data);
    },
    onSuccess: (_, variables) => {
      // Convertir empleadoId a string para las queries si es número
      const empleadoIdString =
        typeof variables.empleadoId === "number"
          ? variables.empleadoId.toString()
          : variables.empleadoId;

      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(empleadoIdString),
      });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.hoy(empleadoIdString),
      });
      toast.success("Asistencia registrada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      console.error("❌ useAsistenciaMutations - Error:", error);
      toast.error(error.message || "Error al registrar asistencia", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const actualizarAsistencia = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActualizarAsistenciaDTO }) =>
      asistenciaService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(data.empleadoId),
      });
      toast.success("Asistencia actualizada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar asistencia", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const eliminarAsistencia = useMutation({
    mutationFn: (id: string) => asistenciaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      toast.success("Asistencia eliminada correctamente", {
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

  const registrarAsistencia = useMutation({
    mutationFn: (data: RegistroAsistencia) => asistenciaService.registrar(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(variables.empleadoId),
      });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.hoy(variables.empleadoId),
      });
      toast.success("Entrada/Salida registrada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const cambiarEstado = useMutation({
    mutationFn: ({
      id,
      estado,
      observaciones,
    }: {
      id: string;
      estado: EstadoAsistencia;
      observaciones?: string;
    }) => asistenciaService.cambiarEstado(id, estado, observaciones),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(data.empleadoId),
      });
      toast.success("Estado actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cambiar estado", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const justificarAsistencia = useMutation({
    mutationFn: ({
      id,
      justificacion,
    }: {
      id: string;
      justificacion: {
        tipo: string;
        descripcion: string;
        documentoUrl?: string;
      };
    }) => asistenciaService.justificar(id, justificacion),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(data.empleadoId),
      });
      toast.success("Justificación enviada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al justificar", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const aprobarJustificacion = useMutation({
    mutationFn: (id: string) => asistenciaService.aprobarJustificacion(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.empleado(data.empleadoId),
      });
      toast.success("Justificación aprobada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al aprobar justificación", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return {
    crearAsistencia: crearAsistencia.mutateAsync,
    actualizarAsistencia: actualizarAsistencia.mutateAsync,
    eliminarAsistencia: eliminarAsistencia.mutateAsync,
    registrarAsistencia: registrarAsistencia.mutateAsync,
    cambiarEstado: cambiarEstado.mutateAsync,
    justificarAsistencia: justificarAsistencia.mutateAsync,
    aprobarJustificacion: aprobarJustificacion.mutateAsync,
    isCreating: crearAsistencia.isPending,
    isUpdating: actualizarAsistencia.isPending,
    isDeleting: eliminarAsistencia.isPending,
    isRegistering: registrarAsistencia.isPending,
  };
};
