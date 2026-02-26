"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Permiso } from "@/app/features/permisos/types";

const ESTADO_COLORS = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  APROBADA: "bg-green-100 text-green-800",
  RECHAZADA: "bg-red-100 text-red-800",
};

export const columns = (
  onVer: (permiso: Permiso) => void,
): ColumnDef<Permiso>[] => [
  {
    accessorKey: "fechaPermiso",
    header: "Fecha Permiso",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaPermiso") as string;
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    },
  },
  {
    accessorKey: "fechaSolicitud",
    header: "Fecha Solicitud",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaSolicitud") as string;
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    },
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => {
      const motivo = row.getValue("motivo") as string;
      return (
        <div className="max-w-75">
          <p className="line-clamp-2">{motivo}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "conGoceSalario",
    header: "Goce Salario",
    cell: ({ row }) => {
      const conGoce = row.getValue("conGoceSalario") as boolean;
      return conGoce ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Sí
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          No
        </Badge>
      );
    },
  },
  {
    accessorKey: "estadoSolicitud",
    header: "Estado",
    cell: ({ row }) => {
      const estado = (row.getValue("estadoSolicitud") as string) || "PENDIENTE";
      return (
        <Badge
          className={ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS]}
          variant="secondary"
        >
          {estado}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fechaAprobacion",
    header: "Fecha Aprobación",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaAprobacion") as string | null;
      if (!fecha) return <span className="text-muted-foreground">-</span>;
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const permiso = row.original;
      return (
        <Button variant="ghost" size="sm" onClick={() => onVer(permiso)}>
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
