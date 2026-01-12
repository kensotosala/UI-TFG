"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Departamento } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const columns = (
  onVer: (departamento: Departamento) => void,
  onEditar: (departamento: Departamento) => void,
  onEliminar: (departamento: Departamento) => void
): ColumnDef<Departamento>[] => [
  {
    accessorKey: "idDepartamento",
    header: "ID",
  },
  {
    accessorKey: "nombreDepartamento",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "idJefeDepartamento",
    header: "Jefe",
    cell: ({ getValue }) => (
      <div className="text-center">{getValue<number | null>() ?? "-"}</div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<"ACTIVO" | "INACTIVO">();
      return (
        <div
          className={`text-center font-medium ${
            estado === "ACTIVO" ? "text-green-600" : "text-red-500"
          }`}
        >
          {estado}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const departamento = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onVer(departamento)}>
                Ver
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEditar(departamento)}>
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => onEliminar(departamento)}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
