import { useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadoService } from "../services/empleados.service";
import { EmpleadoCreateDTO, Empleado } from "../types";
import { toast } from "react-toastify";

export const useEmpleadoMutations = () => {
  const queryClient = useQueryClient();

  const createEmpleado = useMutation({
    mutationFn: (data: EmpleadoCreateDTO) => empleadoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("✅ Empleado creado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el empleado", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const updateEmpleado = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Empleado> }) =>
      empleadoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("✅ Empleado actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el empleado", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const deleteEmpleado = useMutation({
    mutationFn: (id: number) => empleadoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("✅ Empleado eliminado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      // Remover el emoji si ya viene en el mensaje
      const message = error.message.startsWith("❌")
        ? error.message
        : `${error.message}`;

      toast.error(message, {
        position: "top-center",
        autoClose: 6000, // Más tiempo para mensajes largos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  return {
    createEmpleado: createEmpleado.mutateAsync,
    updateEmpleado: updateEmpleado.mutateAsync,
    deleteEmpleado: deleteEmpleado.mutateAsync,
    isCreating: createEmpleado.isPending,
    isUpdating: updateEmpleado.isPending,
    isDeleting: deleteEmpleado.isPending,
  };
};
