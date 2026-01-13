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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { HoraExtra, EstadoSolicitud } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Obtener color del badge según el estado
 */
const getEstadoBadge = (estado: EstadoSolicitud) => {
  const badges: Record<
    EstadoSolicitud,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoSolicitud.PENDIENTE]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    [EstadoSolicitud.APROBADA]: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [EstadoSolicitud.RECHAZADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
  };

  return badges[estado];
};

/**
 * Formatear minutos a horas
 */
const formatearMinutos = (minutos: number): string => {
  if (!minutos) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

export const columns = (
  onVer: (horaExtra: HoraExtra) => void,
  onEditar: (horaExtra: HoraExtra) => void,
  onEliminar: (horaExtra: HoraExtra) => void,
  onAprobar?: (horaExtra: HoraExtra) => void,
  onRechazar?: (horaExtra: HoraExtra) => void
): ColumnDef<HoraExtra>[] => [
  {
    accessorKey: "idHoraExtra",
    header: "ID",
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue<number>()}</div>
    ),
  },
  {
    accessorKey: "nombreEmpleado",
    header: "Empleado",
    cell: ({ row }) => {
      const horaExtra = row.original;
      return (
        <div>
          <p className="font-medium">{horaExtra.nombreEmpleado}</p>
          <p className="text-xs text-gray-500">{horaExtra.codigoEmpleado}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "fechaSolicitud",
    header: "Fecha Solicitud",
    cell: ({ getValue }) => {
      const fecha = getValue<string>();
      return (
        <div className="text-sm">
          {format(new Date(fecha), "dd/MM/yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "fechaInicio",
    header: "Inicio",
    cell: ({ getValue }) => {
      const fecha = getValue<string>();
      return (
        <div className="text-sm">
          {format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "fechaFin",
    header: "Fin",
    cell: ({ getValue }) => {
      const fecha = getValue<string>();
      return (
        <div className="text-sm">
          {format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "horasTotales",
    header: () => <div className="text-center">Horas Totales</div>,
    cell: ({ getValue }) => (
      <div className="text-center font-medium">
        {formatearMinutos(getValue<number>())}
      </div>
    ),
  },
  {
    accessorKey: "tipoHoraExtra",
    header: "Tipo",
    cell: ({ getValue }) => (
      <Badge variant="outline">{getValue<string>()}</Badge>
    ),
  },
  {
    accessorKey: "estadoSolicitud",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<EstadoSolicitud>();
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
      const horaExtra = row.original;
      const puedeEditar =
        horaExtra.estadoSolicitud === EstadoSolicitud.PENDIENTE;
      const puedeAprobar =
        horaExtra.estadoSolicitud === EstadoSolicitud.PENDIENTE;

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

              <DropdownMenuItem onClick={() => onVer(horaExtra)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </DropdownMenuItem>

              {puedeEditar && (
                <DropdownMenuItem onClick={() => onEditar(horaExtra)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}

              {puedeAprobar && onAprobar && onRechazar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAprobar(horaExtra)}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRechazar(horaExtra)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onEliminar(horaExtra)}
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
