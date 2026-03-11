"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { evaluacionesRendimientoService } from "../services/evaluaciones-rendimiento.service";
import { evaluacionesRendimientoKeys } from "../queries/evaluaciones-rendimiento.queries";
import type { CreateEvaluacionDto, UpdateEvaluacionDto } from "../types";

// Create

export function useCreateEvaluacionRendimiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEvaluacionDto) =>
      evaluacionesRendimientoService.create(data),

    onSuccess: (result) => {
      if (!result.exitoso) {
        const mensajeError =
          result.errores?.length > 0
            ? result.errores.join(" | ")
            : result.mensaje;
        toast.error(mensajeError);
        return;
      }
      // Invalida la lista para refetch automático
      queryClient.invalidateQueries({
        queryKey: evaluacionesRendimientoKeys.lists(),
      });
      toast.success(result.mensaje ?? "Evaluación creada exitosamente.");
    },

    onError: (error: Error) => {
      toast.error(error.message ?? "Error inesperado al crear la evaluación.");
    },
  });
}

// Update

export function useUpdateEvaluacionRendimiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEvaluacionDto }) =>
      evaluacionesRendimientoService.update(id, data),

    onSuccess: (result, variables) => {
      if (!result.exitoso) {
        const mensajeError =
          result.errores?.length > 0
            ? result.errores.join(" | ")
            : result.mensaje;
        toast.error(mensajeError);
        return;
      }
      // Invalida lista y detalle específico
      queryClient.invalidateQueries({
        queryKey: evaluacionesRendimientoKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: evaluacionesRendimientoKeys.detail(variables.id),
      });
      toast.success(result.mensaje ?? "Evaluación actualizada exitosamente.");
    },

    onError: (error: Error) => {
      toast.error(
        error.message ?? "Error inesperado al actualizar la evaluación.",
      );
    },
  });
}

// Delete (soft)

export function useDeleteEvaluacionRendimiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluacionesRendimientoService.delete(id),

    onSuccess: (result, id) => {
      if (!result.exitoso) {
        toast.error(result.mensaje ?? "No se pudo anular la evaluación.");
        return;
      }
      // Invalida lista y elimina detalle del caché
      queryClient.invalidateQueries({
        queryKey: evaluacionesRendimientoKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: evaluacionesRendimientoKeys.detail(id),
      });
      toast.success(result.mensaje ?? "Evaluación anulada exitosamente.");
    },

    onError: (error: Error) => {
      toast.error(error.message ?? "Error inesperado al anular la evaluación.");
    },
  });
}
