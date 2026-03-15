"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AguinaldoDTO } from "../../../../aguinaldos/types";

export const columnsEmpleado = (
  onVer: (aguinaldo: AguinaldoDTO) => void,
): ColumnDef<AguinaldoDTO>[] => [
  // {
  //   accessorKey: "anio",
  //   header: () => <div className="text-center">Año</div>,
  //   cell: ({ row }) => {
  //     const value = row.getValue("anio");
  //     const fecha = new Date(value as number | string);
  //     const year = fecha.getFullYear();

  //     return (
  //       <div className="text-center font-semibold">
  //         {Number.isNaN(year) ? "-" : year}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "anio",
    header: () => <div className="text-center">Año</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.getValue("anio")}</div>
    ),
  },
  {
    accessorKey: "diasTrabajados",
    header: () => <div className="text-center">Días Trabajados</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">{row.original.diasTrabajados}</div>
        <div className="text-xs text-muted-foreground">días</div>
      </div>
    ),
  },
  {
    accessorKey: "salarioPromedio",
    header: () => <div className="text-center">Salario Promedio</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono">
        ₡{row.original.salarioPromedio.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "montoAguinaldo",
    header: () => <div className="text-center">Monto Aguinaldo</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono text-lg font-bold text-green-700">
        ₡{row.original.montoAguinaldo.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    id: "acciones",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const aguinaldo = row.original;

      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVer(aguinaldo)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles
          </Button>
        </div>
      );
    },
  },
];
