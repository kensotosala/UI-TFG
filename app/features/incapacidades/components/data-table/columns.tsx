"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Incapacidad,
  TIPOS_INCAPACIDAD,
  ESTADOS_INCAPACIDAD,
} from "../../types";
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
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
import { Empleado } from "@/app/features/empleados/types";
import { isWithinInterval, parseISO } from "date-fns";

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    [TIPOS_INCAPACIDAD.ENFERMEDAD]: "Enfermedad",
    [TIPOS_INCAPACIDAD.ACCIDENTE]: "Accidente",
    [TIPOS_INCAPACIDAD.MATERNIDAD]: "Maternidad",
    [TIPOS_INCAPACIDAD.PATERNIDAD]: "Paternidad",
  };
  return labels[tipo] || tipo;
};

const getTipoBadge = (tipo: string) => {
  const badges: Record<string, { className: string }> = {
    [TIPOS_INCAPACIDAD.ENFERMEDAD]: {
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    [TIPOS_INCAPACIDAD.ACCIDENTE]: {
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    [TIPOS_INCAPACIDAD.MATERNIDAD]: {
      className: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    },
    [TIPOS_INCAPACIDAD.PATERNIDAD]: {
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    },
  };
  return badges[tipo] || { className: "" };
};

const getEstadoBadge = (estado: string) => {
  const badges: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [ESTADOS_INCAPACIDAD.ACTIVA]: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [ESTADOS_INCAPACIDAD.FINALIZADA]: {
      variant: "secondary",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    },
    [ESTADOS_INCAPACIDAD.CANCELADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
  };
  return (
    badges[estado] || {
      variant: "outline" as const,
      className: "",
    }
  );
};

export const columns = (
  onVer: (incapacidad: Incapacidad) => void,
  onEditar: (incapacidad: Incapacidad) => void,
  onEliminar: (incapacidad: Incapacidad) => void,
  empleados: Empleado[],
): ColumnDef<Incapacidad>[] => [
  {
    accessorKey: "empleadoNombre",
    id: "empleadoNombre",
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
    cell: ({ row }) => {
      const empleado = empleados.find(
        (e) => e.idEmpleado === row.original.empleadoId,
      );
      return empleado
        ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido}`
        : `Empleado #${row.original.empleadoId}`;
    },
    // Habilitar filtro de texto (búsqueda)
    filterFn: (row, columnId, filterValue: string) => {
      const empleado = empleados.find(
        (e) => e.idEmpleado === row.original.empleadoId,
      );
      const nombreCompleto = empleado
        ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido}`.toLowerCase()
        : "";
      return nombreCompleto.includes(filterValue.toLowerCase());
    },
    // Función de ordenamiento personalizada
    sortingFn: (rowA, rowB) => {
      const empA = empleados.find(
        (e) => e.idEmpleado === rowA.original.empleadoId,
      );
      const empB = empleados.find(
        (e) => e.idEmpleado === rowB.original.empleadoId,
      );
      const nombreA = empA ? `${empA.nombre} ${empA.primerApellido}` : "";
      const nombreB = empB ? `${empB.nombre} ${empB.primerApellido}` : "";
      return nombreA.localeCompare(nombreB);
    },
  },
  {
    accessorKey: "tipoIncapacidad",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Tipo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const tipo = row.original.tipoIncapacidad;
      const badge = getTipoBadge(tipo);
      return (
        <Badge variant="outline" className={badge.className}>
          {getTipoLabel(tipo)}
        </Badge>
      );
    },
    // Habilitar filtro exacto
    filterFn: "equals",
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Estado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const estado = row.original.estado;
      const badgeConfig = getEstadoBadge(estado);
      return (
        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
          {estado}
        </Badge>
      );
    },
    // Habilitar filtro exacto
    filterFn: "equals",
  },
  {
    accessorKey: "fechaInicio",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Fecha Inicio
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaInicio);
      return (
        <div className="font-medium">
          {fecha.toLocaleDateString("es-CR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
    // Habilitar filtro personalizado de rango de fechas
    filterFn: (row, columnId, filterValue: { desde: Date; hasta: Date }) => {
      if (!filterValue) return true;
      const fecha = parseISO(row.getValue(columnId) as string);
      return isWithinInterval(fecha, {
        start: filterValue.desde,
        end: filterValue.hasta,
      });
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "fechaFin",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Fecha Fin
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaFin);
      return (
        <div className="font-medium">
          {fecha.toLocaleDateString("es-CR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "diasIncapacidad",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Días
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const inicio = new Date(row.original.fechaInicio);
      const fin = new Date(row.original.fechaFin);
      const dias =
        Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) +
        1;
      return (
        <div className="text-center font-semibold text-blue-600">
          {dias} {dias === 1 ? "día" : "días"}
        </div>
      );
    },
  },
  {
    accessorKey: "diagnostico",
    header: "Diagnóstico",
    cell: ({ row }) => {
      const diagnostico = row.original.diagnostico;
      return (
        <div className="max-w-62.5 truncate" title={diagnostico}>
          {diagnostico}
        </div>
      );
    },
  },
  {
    accessorKey: "archivoAdjunto",
    header: () => <div className="text-center">Adjunto</div>,
    cell: ({ row }) => {
      const archivo = row.original.archivoAdjunto;
      if (!archivo)
        return (
          <div className="text-center">
            <span className="text-muted-foreground">-</span>
          </div>
        );

      return (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
            <a
              href={archivo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      );
    },
  },
  {
    id: "acciones",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const incapacidad = row.original;

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
              <DropdownMenuItem onClick={() => onVer(incapacidad)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditar(incapacidad)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEliminar(incapacidad)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
