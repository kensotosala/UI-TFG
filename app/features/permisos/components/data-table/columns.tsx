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
  ArrowUpDown,
} from "lucide-react";
import { Permiso, EstadoPermiso } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { JSX } from "react";
import { Empleado } from "@/app/features/empleados/types";
import { isWithinInterval, parseISO } from "date-fns";

/**
 * Obtener color del badge según el estado
 */
const getEstadoBadge = (estado: EstadoPermiso | string | null) => {
  const badges: Record<
    EstadoPermiso,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoPermiso.PENDIENTE]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    [EstadoPermiso.APROBADA]: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [EstadoPermiso.RECHAZADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
  };

  if (!estado || !(estado in badges)) {
    return badges[EstadoPermiso.PENDIENTE];
  }

  return badges[estado as EstadoPermiso];
};

/**
 * Helper para formatear fechas de manera segura
 */
const formatearFecha = (
  fecha: string | null | undefined,
  formato: string = "dd/MM/yyyy",
): JSX.Element => {
  if (!fecha) {
    return <span className="text-muted-foreground">—</span>;
  }

  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return <span className="text-destructive text-xs">Fecha inválida</span>;
    }
    return <>{format(date, formato, { locale: es })}</>;
  } catch (error) {
    console.error("Error formateando fecha:", fecha, error);
    return <span className="text-destructive text-xs">Error de fecha</span>;
  }
};

/**
 * Columnas de la tabla de permisos
 */
export const columns = (
  onVer: (permiso: Permiso) => void,
  onEditar: (permiso: Permiso) => void,
  onEliminar: (permiso: Permiso) => void,
  onAprobar: ((permiso: Permiso) => void) | undefined,
  onRechazar: ((permiso: Permiso) => void) | undefined,
  empleados: Empleado[],
): ColumnDef<Permiso>[] => [
  {
    accessorKey: "idPermiso",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue<number>()}</div>
    ),
  },
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
      const permiso = row.original;
      const emp = empleados.find((e) => e.idEmpleado === permiso.empleadoId);

      return (
        <div>
          <p className="font-medium">
            {emp
              ? `${emp.nombre} ${emp.primerApellido} ${emp.segundoApellido}`
              : `Empleado #${permiso.empleadoId}`}
          </p>
        </div>
      );
    },
    // Habilitar filtro de texto (búsqueda)
    filterFn: (row, columnId, filterValue: string) => {
      const permiso = row.original;
      const emp = empleados.find((e) => e.idEmpleado === permiso.empleadoId);
      const nombreCompleto = emp
        ? `${emp.nombre} ${emp.primerApellido} ${emp.segundoApellido}`.toLowerCase()
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
    accessorKey: "fechaSolicitud",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Fecha Solicitud
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const fecha = getValue<string | null>();
      return <div className="text-sm">{formatearFecha(fecha)}</div>;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "fechaPermiso",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Fecha Permiso
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const fecha = getValue<string | null>();
      return <div className="text-sm font-medium">{formatearFecha(fecha)}</div>;
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
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ getValue }) => {
      const motivo = getValue<string>();
      return (
        <div className="max-w-50 truncate" title={motivo}>
          {motivo}
        </div>
      );
    },
  },
  {
    accessorKey: "conGoceSalario",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Con Goce
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => {
      const conGoce = getValue<boolean | null>();
      return (
        <div className="text-center">
          {conGoce ? (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Sí
            </Badge>
          ) : (
            <Badge variant="outline">No</Badge>
          )}
        </div>
      );
    },
    // Filtro personalizado para boolean
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === "") return true;
      const valor = row.getValue(columnId);
      return filterValue === "true" ? valor === true : valor === false;
    },
  },
  {
    accessorKey: "estadoSolicitud",
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
    cell: ({ getValue }) => {
      const estado = getValue<string | null>();
      const badgeConfig = getEstadoBadge(estado);
      return (
        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
          {estado || EstadoPermiso.PENDIENTE}
        </Badge>
      );
    },
    // Habilitar filtro exacto
    filterFn: "equals",
  },
  {
    accessorKey: "jefeApruebaId",
    header: "Aprobado Por",
    cell: ({ row }) => {
      const permiso = row.original;
      if (!permiso.jefeApruebaId) {
        return <span className="text-sm text-gray-400">—</span>;
      }
      return (
        <div className="text-sm">
          <p>Jefe #{permiso.jefeApruebaId}</p>
          {permiso.fechaAprobacion && (
            <p className="text-xs text-gray-500">
              {formatearFecha(permiso.fechaAprobacion)}
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const permiso = row.original;
      const puedeEditar = permiso.estadoSolicitud === EstadoPermiso.PENDIENTE;
      const puedeAprobar = permiso.estadoSolicitud === EstadoPermiso.PENDIENTE;

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

              <DropdownMenuItem onClick={() => onVer(permiso)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </DropdownMenuItem>

              {puedeEditar && (
                <DropdownMenuItem onClick={() => onEditar(permiso)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}

              {puedeAprobar && onAprobar && onRechazar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAprobar(permiso)}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRechazar(permiso)}
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
                onClick={() => onEliminar(permiso)}
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
