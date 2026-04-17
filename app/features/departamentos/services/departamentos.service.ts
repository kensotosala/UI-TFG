import { Departamento } from "../types";
import api from "@/lib/axios-config";

const BASE = "/Departamentos";

export const departamentoService = {
  getAll: async (): Promise<Departamento[]> => {
    const { data } = await api.get<Departamento[]>(BASE);
    return data;
  },

  getById: async (id: number): Promise<Departamento> => {
    const { data } = await api.get<Departamento>(`${BASE}/${id}`);
    return data;
  },

  create: async (
    departamento: Pick<
      Departamento,
      "nombreDepartamento" | "descripcion" | "idJefeDepartamento"
    >,
  ): Promise<Departamento> => {
    const { data } = await api.post<Departamento>(BASE, departamento);
    return data;
  },

  update: async (
    id: number,
    departamento: Partial<
      Pick<
        Departamento,
        "nombreDepartamento" | "descripcion" | "idJefeDepartamento" | "estado"
      >
    >,
  ): Promise<Departamento> => {
    const { data } = await api.put<Departamento>(`${BASE}/${id}`, departamento);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
