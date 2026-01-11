import axios from "axios";
import { Puesto } from "../types";

const API_BASE_URL = "https://localhost:7121/api";

export const puestoService = {
  getAll: async (): Promise<Puesto[]> => {
    const { data } = await axios.get<Puesto[]>(`${API_BASE_URL}/Puestos`);
    return data;
  },
};
