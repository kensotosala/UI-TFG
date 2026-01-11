/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { puestoService } from "../services/puestos.service";
import { Puesto } from "../types";
import { useToast } from "@/hooks/use-toast";

export const usePuestoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: puestoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
      toast({
        title: "Éxito",
        description: "Puesto creado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al crear el puesto",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, puesto }: { id: number; puesto: Partial<Puesto> }) =>
      puestoService.update(id, puesto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
      toast({
        title: "Éxito",
        description: "Puesto actualizado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al actualizar el puesto",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: puestoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
      toast({
        title: "Éxito",
        description: "Puesto eliminado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al eliminar el puesto",
        variant: "destructive",
      });
    },
  });

  return {
    createPuesto: createMutation.mutateAsync,
    updatePuesto: updateMutation.mutateAsync,
    deletePuesto: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
