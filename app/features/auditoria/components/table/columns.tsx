"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditoriaCambios } from "../../types";

export const columns: ColumnDef<AuditoriaCambios>[] = [
  {
    accessorKey: "idAuditoria",
    header: "ID",
  },
  {
    accessorKey: "tablaAfectada",
    header: "Tabla",
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
  },
  {
    accessorKey: "usuarioId",
    header: "Usuario",
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha",
  },
];
