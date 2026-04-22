import { Rol } from "../types";
import api from "@/lib/axios-config";

export const rolesService = {
  getAll: async (): Promise<Rol[]> => {
    const { data } = await api.get("/Rol");
    return data;
  },
};
