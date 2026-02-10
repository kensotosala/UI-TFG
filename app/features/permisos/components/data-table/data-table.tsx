/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rangoRapido, setRangoRapido] = React.useState<string>("todos");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    // Filtro personalizado para fechas
    filterFns: {
      dateRange: (row, columnId, filterValue: { desde: Date; hasta: Date }) => {
        const fecha = parseISO(row.getValue(columnId) as string);
        return isWithinInterval(fecha, {
          start: filterValue.desde,
          end: filterValue.hasta,
        });
      },
    },
  });

  // Función para aplicar filtro de fecha
  const aplicarFiltroFecha = (rango: string) => {
    setRangoRapido(rango);

    if (rango === "todos") {
      setColumnFilters((prev) =>
        prev.filter((filter) => filter.id !== "fechaPermiso"),
      );
      return;
    }

    const hoy = new Date();
    let desde: Date;
    let hasta: Date;

    switch (rango) {
      case "hoy":
        desde = hoy;
        hasta = hoy;
        break;
      case "semana":
        desde = startOfWeek(hoy, { weekStartsOn: 1 });
        hasta = endOfWeek(hoy, { weekStartsOn: 1 });
        break;
      case "mes":
        desde = startOfMonth(hoy);
        hasta = endOfMonth(hoy);
        break;
      default:
        return;
    }

    setColumnFilters((prev) => {
      const otherFilters = prev.filter(
        (filter) => filter.id !== "fechaPermiso",
      );
      return [
        ...otherFilters,
        {
          id: "fechaPermiso",
          value: { desde, hasta },
        },
      ];
    });
  };

  const limpiarFiltros = () => {
    setColumnFilters([]);
    setRangoRapido("todos");
  };

  const filtrosActivos = columnFilters.length;

  return (
    <div className="space-y-4">
      {/* BARRA DE FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscar por empleado */}
        <Input
          placeholder="Buscar empleado..."
          value={
            (table.getColumn("empleadoNombre")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("empleadoNombre")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Filtro por estado */}
        <Select
          value={
            (table.getColumn("estadoSolicitud")?.getFilterValue() as string) ??
            "TODOS"
          }
          onValueChange={(value) =>
            table
              .getColumn("estadoSolicitud")
              ?.setFilterValue(value === "TODOS" ? "" : value)
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los estados</SelectItem>
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            <SelectItem value="APROBADA">Aprobada</SelectItem>
            <SelectItem value="RECHAZADA">Rechazada</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro con goce de salario */}
        <Select
          value={
            (table.getColumn("conGoceSalario")?.getFilterValue() as string) ??
            "TODOS"
          }
          onValueChange={(value) =>
            table
              .getColumn("conGoceSalario")
              ?.setFilterValue(value === "TODOS" ? "" : value)
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Con Goce" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Con/Sin Goce</SelectItem>
            <SelectItem value="true">Con Goce</SelectItem>
            <SelectItem value="false">Sin Goce</SelectItem>
          </SelectContent>
        </Select>

        {/* Rangos rápidos de fecha (fecha del permiso) */}
        <div className="flex gap-2">
          <Button
            variant={rangoRapido === "hoy" ? "default" : "outline"}
            size="sm"
            onClick={() => aplicarFiltroFecha("hoy")}
          >
            Hoy
          </Button>
          <Button
            variant={rangoRapido === "semana" ? "default" : "outline"}
            size="sm"
            onClick={() => aplicarFiltroFecha("semana")}
          >
            Esta Semana
          </Button>
          <Button
            variant={rangoRapido === "mes" ? "default" : "outline"}
            size="sm"
            onClick={() => aplicarFiltroFecha("mes")}
          >
            Este Mes
          </Button>
          <Button
            variant={rangoRapido === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => aplicarFiltroFecha("todos")}
          >
            Todos
          </Button>
        </div>

        {/* Botón limpiar filtros */}
        {filtrosActivos > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarFiltros}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Limpiar ({filtrosActivos})
          </Button>
        )}
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        Mostrando {table.getFilteredRowModel().rows.length} de {data.length}{" "}
        permisos
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINACIÓN */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            de {table.getFilteredRowModel().rows.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
