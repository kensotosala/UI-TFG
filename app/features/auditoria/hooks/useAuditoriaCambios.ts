"use client";

import { useQuery } from "@tanstack/react-query";
import {
  auditoriaKeys,
  listarAuditoriaCambios,
} from "../queries/auditoria.queries";

export function useAuditoriaCambios() {
  return useQuery({
    queryKey: auditoriaKeys.lists(),
    queryFn: listarAuditoriaCambios,
    staleTime: 1000 * 60,
  });
}
