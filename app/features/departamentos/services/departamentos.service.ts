import axios from "axios";
import { Departamento } from "../types";

const API_BASE_URL = "https://localhost:7121/api";

export const departamentoService = {
  // Listar todos los departamentos
  getAll: async (): Promise<Departamento[]> => {
    const { data } = await axios.get<Departamento[]>(
      `${API_BASE_URL}/Departamentos`
    );
    return data;
  },

  // Obtener un departamento por ID
  getById: async (id: number): Promise<Departamento> => {
    const { data } = await axios.get<Departamento>(
      `${API_BASE_URL}/Departamentos/${id}`
    );
    return data;
  },

  // Crear nuevo departamento
  create: async (
    departamento: Pick<
      Departamento,
      "nombreDepartamento" | "descripcion" | "idJefeDepartamento"
    >
  ): Promise<Departamento> => {
    const { data } = await axios.post<Departamento>(
      `${API_BASE_URL}/Departamentos`,
      departamento
    );
    return data;
  },

  // Actualizar departamento existente
  update: async (
    id: number,
    departamento: Pick<
      Departamento,
      "nombreDepartamento" | "descripcion" | "idJefeDepartamento" | "estado"
    >
  ): Promise<Departamento> => {
    const { data } = await axios.put<Departamento>(
      `${API_BASE_URL}/Departamentos/${id}`,
      departamento
    );
    return data;
  },

  // Eliminar departamento
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/Departamentos/${id}`);
  },
};
