"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AsistenciaDetallada, EstadoAsistencia } from "../../types";

const getEstadoBadge = (estado: EstadoAsistencia) => {
  const badges: Record<
    EstadoAsistencia,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoAsistencia.PRESENTE]: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [EstadoAsistencia.AUSENTE]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    [EstadoAsistencia.TARDANZA]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    [EstadoAsistencia.JUSTIFICADO]: {
      variant: "outline",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    [EstadoAsistencia.PERMISO]: {
      variant: "outline",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    },
    [EstadoAsistencia.VACACIONES]: {
      variant: "outline",
      className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    },
    [EstadoAsistencia.LICENCIA_MEDICA]: {
      variant: "outline",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
  };

  return badges[estado];
};

const formatearMinutos = (minutos?: number): string => {
  if (!minutos) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

export const columnsEmpleado = (
  onVer: (asistencia: AsistenciaDetallada) => void,
): ColumnDef<AsistenciaDetallada>[] => [
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ getValue }) => {
      const fecha = getValue<string>();
      return (
        <div className="font-medium">
          {format(new Date(fecha), "dd/MM/yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "horaEntrada",
    header: () => <div className="text-center">Entrada</div>,
    cell: ({ getValue }) => {
      const hora = getValue<string | null>();
      return (
        <div className="text-center font-mono">
          {hora ? format(new Date(`2000-01-01T${hora}`), "HH:mm") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "horaSalida",
    header: () => <div className="text-center">Salida</div>,
    cell: ({ getValue }) => {
      const hora = getValue<string | null>();
      return (
        <div className="text-center font-mono">
          {hora ? format(new Date(`2000-01-01T${hora}`), "HH:mm") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "horasTrabajadas",
    header: () => <div className="text-center">Horas Trabajadas</div>,
    cell: ({ getValue }) => (
      <div className="text-center font-medium">
        {formatearMinutos(getValue<number>())}
      </div>
    ),
  },
  {
    accessorKey: "tiempoExtra",
    header: () => <div className="text-center">Tiempo Extra</div>,
    cell: ({ getValue }) => {
      const minutos = getValue<number>();
      return (
        <div className="text-center font-medium text-orange-600">
          {minutos > 0 ? formatearMinutos(minutos) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<EstadoAsistencia>();
      const badgeConfig = getEstadoBadge(estado);
      return (
        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
          {estado}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const asistencia = row.original;
      return (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={() => onVer(asistencia)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
        </div>
      );
    },
  },
];
