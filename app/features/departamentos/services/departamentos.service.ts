import axios from "axios";
import { Departamento } from "../types";
import api from "@/lib/axios-config";

const BASE = "/Departamentos";

export const departamentoService = {
  // Listar todos los departamentos
  getAll: async (): Promise<Departamento[]> => {
    const { data } = await api.get<Departamento[]>(BASE);
    return data;
  },

  // Obtener un departamento por ID
  getById: async (id: number): Promise<Departamento> => {
    const { data } = await api.get<Departamento>(BASE);
    return data;
  },

  // Crear nuevo departamento
  create: async (
    departamento: Pick<
      Departamento,
      "nombreDepartamento" | "descripcion" | "idJefeDepartamento"
    >,
  ): Promise<Departamento> => {
    const { data } = await axios.post<Departamento>(BASE, departamento);
    return data;
  },

  // Actualizar departamento existente
  update: async (
    id: number,
    departamento: Partial<
      Pick<
        Departamento,
        "nombreDepartamento" | "descripcion" | "idJefeDepartamento" | "estado"
      >
    >,
  ): Promise<Departamento> => {
    const { data } = await axios.put<Departamento>(BASE, departamento);
    return data;
  },

  // Eliminar departamento
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE}/${id}`);
  },
};
