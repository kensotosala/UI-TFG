import axios from "axios";
import { Puesto } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const puestoService = {
  getAll: async (): Promise<Puesto[]> => {
    const { data } = await axios.get<Puesto[]>(`${API_BASE_URL}/puestos`);
    return data;
  },
};
