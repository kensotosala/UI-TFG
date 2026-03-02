"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LiquidacionDTO } from "../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const EmpleadoCell = ({ idEmpleado }: { idEmpleado: number }) => {
  const { empleados } = useEmpleados();
  const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
  return (
    <span>
      {empleado
        ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido}`
        : "Desconocido"}
    </span>
  );
};

export const columns = (
  onVer: (liquidacion: LiquidacionDTO) => void,
  onEditar: (liquidacion: LiquidacionDTO) => void,
  onEliminar: (liquidacion: LiquidacionDTO) => void,
): ColumnDef<LiquidacionDTO>[] => [
  {
    accessorKey: "idLiquidacion",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("idLiquidacion")}</span>
    ),
  },
  {
    accessorKey: "idEmpleado",
    header: "Empleado",
    cell: ({ row }) => <EmpleadoCell idEmpleado={row.getValue("idEmpleado")} />,
  },
  {
    accessorKey: "montoPreaviso",
    header: "Monto Preaviso",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoPreaviso")),
  },
  {
    accessorKey: "montoVacaciones",
    header: "Monto Vacaciones",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoVacaciones")),
  },
  {
    accessorKey: "montoCesantia",
    header: "Monto Cesantía",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoCesantia")),
  },
  {
    accessorKey: "montoTotal",
    header: "Monto Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoTotal")),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado");
      const colorClass = estado === "CALCULADA" ? "bg-green-500" : "bg-red-500";
      return (
        <span
          className={`px-2 py-1 rounded text-white text-sm font-medium ${colorClass}`}
        >
          {estado === "CALCULADA" ? "Calculada" : "Anulada"}
        </span>
      );
    },
  },
  {
    id: "acciones",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const liquidacion = row.original;

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
              <DropdownMenuItem onClick={() => onVer(liquidacion)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>

              {liquidacion.estado != "ANULADA" && (
                <>
                  <DropdownMenuItem onClick={() => onEditar(liquidacion)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onEliminar(liquidacion)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Anular
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
