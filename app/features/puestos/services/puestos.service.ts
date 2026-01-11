import axios from "axios";
import { Puesto } from "../types";

const API_BASE_URL = "https://localhost:7121/api";

export const puestoService = {
  // Listar todos
  getAll: async (): Promise<Puesto[]> => {
    const { data } = await axios.get<Puesto[]>(`${API_BASE_URL}/Puestos`);
    return data;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Puesto> => {
    const { data } = await axios.get<Puesto>(`${API_BASE_URL}/Puestos/${id}`);
    return data;
  },

  // Crear nuevo puesto
  create: async (
    puesto: Omit<Puesto, "idPuesto" | "fechaCreacion" | "fechaModificacion">
  ): Promise<Puesto> => {
    const { data } = await axios.post<Puesto>(
      `${API_BASE_URL}/Puestos`,
      puesto
    );
    return data;
  },

  // Actualizar puesto existente
  update: async (id: number, puesto: Partial<Puesto>): Promise<Puesto> => {
    const { data } = await axios.put<Puesto>(
      `${API_BASE_URL}/Puestos/${id}`,
      puesto
    );
    return data;
  },

  // Eliminar puesto
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/Puestos/${id}`);
  },

  // Cambiar estado activo/inactivo
  toggleEstado: async (id: number): Promise<Puesto> => {
    const { data } = await axios.patch<Puesto>(
      `${API_BASE_URL}/Puestos/${id}/toggle-estado`
    );
    return data;
  },
};
