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
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { EvaluacionRendimientoResponse } from "../../types";

// Helpers

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const getBadgeVariant = (estado: string) => {
  switch (estado.toUpperCase()) {
    case "APROBADA":
      return "default";
    case "ANULADA":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPuntuacionColor = (puntuacion: number) => {
  if (puntuacion >= 80) return "text-green-600 font-semibold";
  if (puntuacion >= 60) return "text-yellow-600 font-semibold";
  return "text-red-600 font-semibold";
};

// Column Factory

interface ColumnActions {
  onView: (evaluacion: EvaluacionRendimientoResponse) => void;
  onEdit: (evaluacion: EvaluacionRendimientoResponse) => void;
  onDelete: (evaluacion: EvaluacionRendimientoResponse) => void;
}

export function getColumns(
  actions: ColumnActions,
): ColumnDef<EvaluacionRendimientoResponse>[] {
  return [
    {
      accessorKey: "idEvaluacion",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="gap-1 px-0"
        >
          ID
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          #{row.original.idEvaluacion}
        </span>
      ),
      size: 70,
    },
    {
      accessorKey: "nombreEmpleado",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="gap-1 px-0"
        >
          Empleado
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.nombreEmpleado}</p>
          <p className="text-xs text-muted-foreground">
            ID: {row.original.empleadoId}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "nombreEvaluador",
      header: "Evaluador",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.original.nombreEvaluador}</p>
          <p className="text-xs text-muted-foreground">
            ID: {row.original.evaluadorId}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "fechaInicio",
      header: "Período",
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{formatDate(row.original.fechaInicio)}</p>
          <p className="text-xs text-muted-foreground">
            → {formatDate(row.original.fechaFin)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "puntuacionTotal",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="gap-1 px-0"
        >
          Puntuación
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const puntuacion = row.original.puntuacionTotal;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-lg ${getPuntuacionColor(puntuacion)}`}>
              {puntuacion}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={getBadgeVariant(row.original.estado)}>
          {row.original.estado}
        </Badge>
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue) return true;
        return row.original.estado.toUpperCase() === filterValue.toUpperCase();
      },
    },
    {
      accessorKey: "detalles",
      header: "Métricas",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.detalles.length} métrica(s)
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        const evaluacion = row.original;
        const isAnulada = evaluacion.estado.toUpperCase() === "ANULADA";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onView(evaluacion)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => actions.onEdit(evaluacion)}
                disabled={isAnulada}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => actions.onDelete(evaluacion)}
                disabled={isAnulada}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Anular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
