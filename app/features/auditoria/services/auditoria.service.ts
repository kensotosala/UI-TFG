import ApiClient from "@/lib/api/client";
import { AuditoriaCambios } from "../types";

type AuditoriaResponse = {
  mensaje: string;
  datos: AuditoriaCambios[];
};

const BASE_URL = "/Auditoria";

const apiClient = ApiClient.getInstance();

export const auditoriaService = {
  getAll: async (): Promise<AuditoriaCambios[]> => {
    const response = await apiClient.get<AuditoriaResponse>(BASE_URL);
    return response.data.datos;
  },
};
