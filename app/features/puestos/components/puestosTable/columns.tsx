"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Puesto } from "../../types";

export const columns: ColumnDef<Puesto>[] = [
  {
    accessorKey: "idPuesto",
    header: "ID",
  },
  {
    accessorKey: "nombrePuesto",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "nivelJerarquico",
    header: "Nivel Jerárquico",
  },
  {
    accessorKey: "salarioMinimo",
    header: "Salario Mínimo",
  },
  {
    accessorKey: "salarioMaximo",
    header: "Salario Máximo",
  },
  {
    accessorKey: "estado",
    header: "Activo",
    // cell: ({ getValue }) => (getValue<boolean>() ? "Sí" : "No"),
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha Creación",
  },
  {
    accessorKey: "fechaModificacion",
    header: "Fecha Modificación",
  },
];
