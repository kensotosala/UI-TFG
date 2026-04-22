import api from "@/lib/axios-config";
import { Puesto, UpdatePuestoDto } from "../types";

const BASE = "/Puestos";

export const puestoService = {
  // Listar todos
  getAll: async (): Promise<Puesto[]> => {
    const { data } = await api.get<Puesto[]>(BASE);
    return data;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Puesto> => {
    const { data } = await api.get<Puesto>(`${BASE}/${id}`);
    return data;
  },

  // Crear nuevo puesto
  create: async (
    puesto: Omit<Puesto, "idPuesto" | "fechaCreacion" | "fechaModificacion">,
  ): Promise<Puesto> => {
    const { data } = await api.post<Puesto>(BASE, puesto);
    return data;
  },

  // Actualizar puesto existente
  update: async (id: number, puesto: UpdatePuestoDto): Promise<void> => {
    const payload = {
      ...puesto,
      idPuesto: id,
    };

    await api.put(`${BASE}/${id}`, payload);
  },

  // Eliminar puesto
  delete: async (id: number): Promise<void> => {
    await api.delete<void>(`${BASE}/${id}`);
  },

  // Cambiar estado activo/inactivo
  toggleEstado: async (id: number): Promise<Puesto> => {
    const { data } = await api.patch<Puesto>(`${BASE}/${id}/toggle-estado`);
    return data;
  },
};
