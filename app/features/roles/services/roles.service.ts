import { Rol } from "../types";

const API_BASE_URL = "https://localhost:7121/api/v1";

export const rolesService = {
  // Listar todos los roles
  getAll: async (): Promise<Rol[]> => {
    const response = await fetch(`${API_BASE_URL}/Rol`);
    if (!response.ok) {
      throw new Error("Error al obtener los roles");
    }
    const data = await response.json();
    return data;
  },
};
