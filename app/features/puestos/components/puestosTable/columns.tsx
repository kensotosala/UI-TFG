"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Puesto } from "../../types";
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
  onVer: (puesto: Puesto) => void,
  onEditar: (puesto: Puesto) => void
): ColumnDef<Puesto>[] => [
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
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue<string>())}</div>
    ),
  },
  {
    accessorKey: "salarioMinimo",
    header: "Salario Mínimo",
    cell: ({ getValue }) => (
      <div className="text-center">${getValue<number>()?.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "salarioMaximo",
    header: "Salario Máximo",
    cell: ({ getValue }) => (
      <div className="text-center">${getValue<number>()?.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Activo",
    cell: ({ getValue }) => (
      <div className="text-center">{getValue<boolean>() ? "Sí" : "No"}</div>
    ),
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha Creación",
    cell: ({ getValue }) => (
      <div className="text-center">
        {new Date(getValue<string>()).toLocaleDateString("es-ES")}
      </div>
    ),
  },
  {
    accessorKey: "fechaModificacion",
    header: "Fecha Modificación",
    cell: ({ getValue }) => (
      <div className="text-center">
        {getValue<string>()
          ? new Date(getValue<string>()).toLocaleDateString("es-ES")
          : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const puesto = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(puesto.idPuesto.toString())
                }
              >
                Copiar ID
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onVer(puesto)}>
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditar(puesto)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
