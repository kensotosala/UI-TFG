"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Ban, ArrowUpDown } from "lucide-react";
import { NominaDTO } from "../../nomina.types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// const getEstadoBadge = (estado?: string) => {
//   const estadoUpper = estado?.toUpperCase() || "PENDIENTE";

//   const variants: Record<string, { variant: any; className: string }> = {
//     PENDIENTE: {
//       variant: "secondary",
//       className: "bg-yellow-100 text-yellow-800 border-yellow-300",
//     },
//     ANULADA: {
//       variant: "destructive",
//       className: "bg-red-100 text-red-800 border-red-300",
//     },
//   };

//   const config = variants[estadoUpper] || variants.PENDIENTE;

//   return (
//     <Badge variant={config.variant} className={config.className}>
//       {estadoUpper}
//     </Badge>
//   );
// };

export const columns = (
  onVer: (nomina: NominaDTO) => void,
  onAnular: (nomina: NominaDTO) => void,
): ColumnDef<NominaDTO>[] => [
  {
    accessorKey: "periodoNomina",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Período
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const fecha = row.original.periodoNomina;
      if (!fecha) return "-";
      try {
        const parsed = parseISO(fecha.toString());
        const dia = parsed.getDate();
        const quincena = dia <= 15 ? "1ª" : "2ª";
        return (
          <div>
            <div className="font-medium">{quincena} Quincena</div>
            <div className="text-xs text-muted-foreground">
              {format(parsed, "MMMM yyyy", { locale: es })}
            </div>
          </div>
        );
      } catch {
        return "-";
      }
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "nombreEmpleado",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Empleado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    accessorKey: "salarioBase",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Salario Base
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        ₡
        {row.original.salarioBase.toLocaleString("es-CR", {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "totalBruto",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Total Bruto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-semibold text-green-700">
        ₡
        {row.original.totalBruto.toLocaleString("es-CR", {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "deducciones",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Deducciones
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-red-600">
        -₡
        {(row.original.deducciones || 0).toLocaleString("es-CR", {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "totalNeto",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Total Neto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-bold text-purple-700">
        ₡
        {row.original.totalNeto.toLocaleString("es-CR", {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  // {
  //   accessorKey: "estado",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       className="hover:bg-transparent"
  //     >
  //       Estado
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => getEstadoBadge(row.original.estado),
  // },
  {
    id: "acciones",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const nomina = row.original;
      const isPendiente = nomina.estado?.toUpperCase() === "PENDIENTE";
      const isAnulada = nomina.estado?.toUpperCase() === "ANULADA";

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

              <DropdownMenuItem onClick={() => onVer(nomina)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>

              {isPendiente && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAnular(nomina)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Anular nómina
                  </DropdownMenuItem>
                </>
              )}

              {isAnulada && (
                <DropdownMenuItem disabled className="text-muted-foreground">
                  Nómina anulada
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
