import axios, { AxiosError } from "axios";
import { Empleado, EmpleadoCreateDTO } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5071/api";

interface ErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}

export const empleadoService = {
  // Obtener todos los empleados
  getAll: async (): Promise<Empleado[]> => {
    const response = await axios.get(`${API_BASE_URL}/Empleados`);
    return response.data;
  },

  // Obtener empleado por ID
  getById: async (id: number): Promise<Empleado> => {
    const response = await axios.get(`${API_BASE_URL}/Empleados/${id}`);
    return response.data;
  },

  // Crear empleado
  create: async (data: EmpleadoCreateDTO): Promise<Empleado> => {
    const response = await axios.post(`${API_BASE_URL}/Empleados`, data);
    return response.data;
  },

  // Actualizar empleado
  update: async (id: number, data: Partial<Empleado>): Promise<void> => {
    await axios.put(`${API_BASE_URL}/Empleados/${id}`, data);
  },

  // Eliminar empleado
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/Empleados/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const { status, data } = axiosError.response;

          // Extraer el mensaje correcto (puede venir en 'message' o 'error')
          const errorMessage =
            data?.message || data?.error || "Error al eliminar el empleado";

          // Error 409 - Conflicto (tiene subordinados u otra restricción)
          if (status === 409) {
            // Personalizar el mensaje según el código de error
            if (data?.error === "EMPLEADO_TIENE_SUBORDINADOS") {
              throw new Error(
                "No se puede eliminar el empleado porque tiene subordinados asignados. " +
                  "Por favor, reasigne los subordinados antes de continuar."
              );
            }

            if (data?.error === "OPERATION_NOT_ALLOWED") {
              throw new Error(errorMessage);
            }

            throw new Error(errorMessage);
          }

          // Error 404 - No encontrado
          if (status === 404) {
            throw new Error("Empleado no encontrado");
          }

          // Error 400 - Solicitud incorrecta
          if (status === 400) {
            throw new Error(`${errorMessage}`);
          }

          // Otros errores
          throw new Error(`${errorMessage}`);
        }
      }

      // Error no relacionado con Axios
      throw new Error("Error de conexión al eliminar el empleado");
    }
  },
};
