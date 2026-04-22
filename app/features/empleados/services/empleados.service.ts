import { AxiosError } from "axios";
import api from "@/lib/axios-config";
import { Empleado, EmpleadoCreateDTO, UsuarioDTO } from "../types";

interface ErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}

export const empleadoService = {
  // Obtener todos los empleados
  getAll: async (): Promise<Empleado[]> => {
    const { data } = await api.get("/Empleados");
    return data;
  },

  // Obtener empleado por ID
  getById: async (id: number): Promise<Empleado> => {
    const { data } = await api.get(`/Empleados/${id}`);
    return data;
  },

  // Obtener usuarios admin
  getUsuariosAdmin: async (): Promise<UsuarioDTO[]> => {
    const { data } = await api.get("/Usuarios/listar-usuarios-admin");
    return data.datos;
  },

  // Obtener empleados sin horas extra en proceso
  getEmpleadosSinHorasExtraEnProceso: async (): Promise<Empleado[]> => {
    const { data } = await api.get(
      "/Empleados/empleados-sin-horas-extra-en-proceso",
    );
    return data;
  },

  // Crear empleado
  create: async (payload: EmpleadoCreateDTO): Promise<Empleado> => {
    const response = await api.post("/Empleados", payload);
    return response.data.data ?? response.data;
  },

  // Actualizar empleado
  update: async (id: number, payload: Partial<Empleado>): Promise<void> => {
    await api.put(`/Empleados/${id}`, payload);
  },

  // Eliminar empleado (con manejo avanzado de errores)
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Empleados/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        // Si ya viene transformado por interceptor, respétalo
        throw error;
      }

      if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const { status, data } = axiosError.response;

          const errorMessage =
            data?.message || data?.error || "Error al eliminar el empleado";

          if (status === 409) {
            if (data?.error === "EMPLEADO_TIENE_SUBORDINADOS") {
              throw new Error(
                "No se puede eliminar el empleado porque tiene subordinados asignados. Reasígnelos antes de continuar.",
              );
            }

            throw new Error(errorMessage);
          }

          if (status === 404) {
            throw new Error("Empleado no encontrado");
          }

          if (status === 400) {
            throw new Error(errorMessage);
          }

          throw new Error(errorMessage);
        }
      }

      throw new Error("Error inesperado al eliminar el empleado");
    }
  },
};
