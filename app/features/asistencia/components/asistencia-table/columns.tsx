/* eslint-disable @next/next/no-img-element */
// components/asistencias/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AsistenciaDetallada, EstadoAsistencia } from "../../types";

/**
 * Obtener color del badge según el estado
 */
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

/**
 * Formatear tiempo en minutos a horas y minutos
 */
const formatearMinutos = (minutos?: number): string => {
  if (!minutos) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

export const columns = (
  onVer: (asistencia: AsistenciaDetallada) => void,
  onEditar: (asistencia: AsistenciaDetallada) => void,
  onEliminar: (asistencia: AsistenciaDetallada) => void,
  onJustificar?: (asistencia: AsistenciaDetallada) => void,
  onAprobar?: (asistencia: AsistenciaDetallada) => void
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
    accessorKey: "empleado.nombreCompleto",
    header: "Empleado",
    cell: ({ row }) => {
      const empleado = row.original.empleado;
      return (
        <div className="flex items-center gap-2">
          {empleado.avatarUrl && (
            <img
              src={empleado.avatarUrl}
              alt={empleado.nombreCompleto}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{empleado.nombreCompleto}</p>
            <p className="text-xs text-gray-500">{empleado.departamento}</p>
          </div>
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
    header: () => <div className="text-center">Horas</div>,
    cell: ({ getValue }) => (
      <div className="text-center font-medium">
        {formatearMinutos(getValue<number>())}
      </div>
    ),
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
      const tieneJustificacion = !!asistencia.justificacion;
      const necesitaJustificacion =
        asistencia.estado === EstadoAsistencia.AUSENTE ||
        asistencia.estado === EstadoAsistencia.TARDANZA;
      const puedeAprobar =
        asistencia.estado === EstadoAsistencia.JUSTIFICADO &&
        !asistencia.justificacion?.aprobadoPor;

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

              <DropdownMenuItem onClick={() => onVer(asistencia)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEditar(asistencia)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              {necesitaJustificacion && !tieneJustificacion && onJustificar && (
                <DropdownMenuItem onClick={() => onJustificar(asistencia)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Justificar
                </DropdownMenuItem>
              )}

              {puedeAprobar && onAprobar && (
                <DropdownMenuItem
                  onClick={() => onAprobar(asistencia)}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar Justificación
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onEliminar(asistencia)}
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
