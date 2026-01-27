"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Trash2 } from "lucide-react";
import {
  ESTADOS_INCAPACIDAD,
  Incapacidad,
  TIPOS_INCAPACIDAD,
} from "../../types";

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    [TIPOS_INCAPACIDAD.ENFERMEDAD]: "Enfermedad",
    [TIPOS_INCAPACIDAD.ACCIDENTE]: "Accidente",
    [TIPOS_INCAPACIDAD.MATERNIDAD]: "Maternidad",
    [TIPOS_INCAPACIDAD.PATERNIDAD]: "Paternidad",
  };
  return labels[tipo] || tipo;
};

export const columns = (
  onVer: (incapacidad: Incapacidad) => void,
  onEliminar: (incapacidad: Incapacidad) => void,
): ColumnDef<Incapacidad>[] => [
  {
    accessorKey: "tipoIncapacidad",
    header: "Tipo",
    cell: ({ row }) => getTipoLabel(row.original.tipoIncapacidad),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      const variant =
        estado === ESTADOS_INCAPACIDAD.ACTIVA ? "default" : "secondary";
      return <Badge variant={variant}>{estado}</Badge>;
    },
  },
  {
    accessorKey: "fechaInicio",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaInicio);
      return fecha.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "fechaFin",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaFin);
      return fecha.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "diagnostico",
    header: "Diagnóstico",
    cell: ({ row }) => {
      const diagnostico = row.original.diagnostico;
      return (
        <div className="max-w-75">
          <p className="line-clamp-2">{diagnostico}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "archivoAdjunto",
    header: "Adjunto",
    cell: ({ row }) => {
      const archivo = row.original.archivoAdjunto;
      if (!archivo) return <span className="text-muted-foreground">-</span>;

      return (
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
      );
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const incapacidad = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVer(incapacidad)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEliminar(incapacidad)}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
