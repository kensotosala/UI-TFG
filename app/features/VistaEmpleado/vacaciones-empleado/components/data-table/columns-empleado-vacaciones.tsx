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
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { ListarVacacionesDTO } from "../../vacaciones.types";

const ESTADO_COLORS = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  APROBADA: "bg-green-100 text-green-800",
  RECHAZADA: "bg-red-100 text-red-800",
  CANCELADA: "bg-gray-100 text-gray-800",
};

const calcularDias = (fechaInicio: string, fechaFin: string): number => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - inicio.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
};

export const columns = (
  onVer: (vacacion: ListarVacacionesDTO) => void,
  onEliminar: (vacacion: ListarVacacionesDTO) => void,
): ColumnDef<ListarVacacionesDTO>[] => [
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
    id: "dias",
    header: "Días",
    cell: ({ row }) => {
      const dias = calcularDias(
        row.original.fechaInicio,
        row.original.fechaFin,
      );
      return (
        <span className="font-semibold text-blue-600">
          {dias} {dias === 1 ? "día" : "días"}
        </span>
      );
    },
  },
  {
    accessorKey: "estadoSolicitud",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estadoSolicitud || "PENDIENTE";
      return (
        <Badge
          className={
            ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS] ||
            ESTADO_COLORS.PENDIENTE
          }
          variant="secondary"
        >
          {estado}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fechaSolicitud",
    header: "Fecha Solicitud",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaSolicitud);
      return (
        <span className="text-sm text-muted-foreground">
          {fecha.toLocaleDateString("es-CR")}
        </span>
      );
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const vacacion = row.original;
      const esPendiente = vacacion.estadoSolicitud === "PENDIENTE";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onVer(vacacion)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>

            {esPendiente && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onEliminar(vacacion)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancelar solicitud
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
