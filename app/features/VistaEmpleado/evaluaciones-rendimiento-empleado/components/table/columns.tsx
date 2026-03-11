"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Star, CheckCircle2, XCircle } from "lucide-react";
import type { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ESTADO_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDIENTE: { label: "Pendiente", variant: "secondary" },
  COMPLETADA: { label: "Completada", variant: "default" },
  ANULADA: { label: "Anulada", variant: "destructive" },
  APROBADA: { label: "Aprobada", variant: "outline" },
};

const getPuntuacionColor = (p: number): string => {
  if (p >= 80) return "text-green-600 dark:text-green-400";
  if (p >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (p >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

interface CreateEmpleadoColumnsOptions {
  onViewDetails: (evaluacion: EvaluacionRendimientoResponse) => void;
  onAprobar: (evaluacion: EvaluacionRendimientoResponse) => void;
  onRechazar: (evaluacion: EvaluacionRendimientoResponse) => void;
}

export function createEmpleadoColumns({
  onViewDetails,
  onAprobar,
  onRechazar,
}: CreateEmpleadoColumnsOptions): ColumnDef<EvaluacionRendimientoResponse>[] {
  return [
    {
      accessorKey: "idEvaluacion",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # ID
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{row.original.idEvaluacion}
        </span>
      ),
    },
    {
      accessorKey: "nombreEvaluador",
      header: "Evaluador",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.original.nombreEvaluador}
          </span>
          <span className="text-xs text-muted-foreground">
            ID: {row.original.evaluadorId}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "fechaInicio",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Período
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{formatDate(row.original.fechaInicio)}</span>
          <span className="text-xs text-muted-foreground">
            hasta {formatDate(row.original.fechaFin)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "puntuacionTotal",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Puntuación
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const p = row.original.puntuacionTotal;
        return (
          <div className="flex items-center gap-1.5">
            <Star className={`h-3.5 w-3.5 ${getPuntuacionColor(p)}`} />
            <span className={`font-semibold text-sm ${getPuntuacionColor(p)}`}>
              {p}/100
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const cfg = ESTADO_CONFIG[row.original.estado] ?? {
          label: row.original.estado,
          variant: "outline" as const,
        };
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
      filterFn: (row, _colId, filterValue) =>
        !filterValue || row.original.estado === filterValue,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => {
        const evaluacion = row.original;
        const isPendiente = evaluacion.estado === "PENDIENTE";

        return (
          <div className="flex items-center justify-end gap-1">
            {/* Ver detalle — siempre visible */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Ver detalle"
              onClick={() => onViewDetails(evaluacion)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Aprobar — solo PENDIENTE */}
            {isPendiente && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
                title="Aprobar evaluación"
                onClick={() => onAprobar(evaluacion)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}

            {/* Rechazar — solo PENDIENTE */}
            {isPendiente && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Rechazar evaluación"
                onClick={() => onRechazar(evaluacion)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
