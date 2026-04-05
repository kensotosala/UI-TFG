/* eslint-disable @typescript-eslint/no-explicit-any */
// app/features/aguinaldo/components/data-table/aguinaldo-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Ban } from "lucide-react";
import { AguinaldoDTO } from "../../types";

const getEstadoBadge = (estado?: string) => {
  let estadoUpper = estado?.toUpperCase() || "PENDIENTE";

  if (estadoUpper === "PAGADO") {
    estadoUpper = "CALCULADO";
  }

  const variants: Record<string, { variant: any; className: string }> = {
    PENDIENTE: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    CALCULADO: {
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    ANULADO: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const config = variants[estadoUpper] || variants.PENDIENTE;

  return (
    <Badge variant={config.variant} className={config.className}>
      {estadoUpper}
    </Badge>
  );
};

export const columns = (
  onVer: (aguinaldo: AguinaldoDTO) => void,
  onPagar: (aguinaldo: AguinaldoDTO) => void,
  onAnular: (aguinaldo: AguinaldoDTO) => void,
): ColumnDef<AguinaldoDTO>[] => [
  {
    accessorKey: "nombreEmpleado",
    header: "Empleado",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.nombreEmpleado}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.codigoEmpleado}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "puesto",
    header: "Puesto",
    cell: ({ row }) => (
      <div className="text-sm text-slate-600">{row.original.puesto}</div>
    ),
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => (
      <div className="text-sm text-slate-500">{row.original.departamento}</div>
    ),
  },
  {
    accessorKey: "anio",
    header: "Año",
  },
  {
    accessorKey: "diasTrabajados",
    header: "Días Trabajados",
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.diasTrabajados} días
      </div>
    ),
  },
  // {
  //   accessorKey: "salarioPromedio",
  //   header: "Salario Promedio",
  //   cell: ({ row }) => (
  //     <div className="text-right font-mono text-sm">
  //       ₡{row.original.salarioPromedio.toLocaleString("es-CR")}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "montoAguinaldo",
    header: "Monto Aguinaldo",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-bold text-green-700">
        ₡{row.original.montoAguinaldo.toLocaleString("es-CR")}
      </div>
    ),
  },

  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => getEstadoBadge(row.original.estado),
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const aguinaldo = row.original;
      const isPendiente = aguinaldo.estado?.toUpperCase() === "PENDIENTE";
      return (
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

            <DropdownMenuItem onClick={() => onVer(aguinaldo)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>

            {isPendiente && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onAnular(aguinaldo)}
                  className="text-destructive focus:text-destructive"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Anular aguinaldo
                </DropdownMenuItem>
              </>
            )}

            {/* {isPagado && (
              <DropdownMenuItem disabled className="text-muted-foreground">
                Aguinaldo ya pagado
              </DropdownMenuItem>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
