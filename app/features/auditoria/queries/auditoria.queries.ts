import { auditoriaService } from "../services/auditoria.service";

export const auditoriaKeys = {
  all: ["auditoria-cambios"] as const,
  lists: () => [...auditoriaKeys.all, "list"] as const,
  detail: (id: number) => [...auditoriaKeys.all, "detail", id] as const,
};

export const listarAuditoriaCambios = async () => {
  return await auditoriaService.getAll();
};
