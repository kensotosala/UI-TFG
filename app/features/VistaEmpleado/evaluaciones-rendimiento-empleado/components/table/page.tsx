/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ClipboardList } from "lucide-react";
import { useEvaluacionesRendimiento } from "@/app/features/evaluaciones-rendimiento/hooks/useEvaluacionesRendimiento";
import { useAuthContext } from "@/components/providers/AuthProvider";
import type { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";
import { createEmpleadoColumns } from "./columns";
import { ApproveDialog } from "./dialogs/approve-dialog";
import { RejectDialog } from "./dialogs/reject-dialog";
import { DetailsDialog } from "./dialogs/details-dialgo";

export default function MisEvaluacionesPage() {
  const { user } = useAuthContext();
  const {
    data: todasEvaluaciones,
    isLoading,
    error,
    refetch,
  } = useEvaluacionesRendimiento();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // ── Estado compartido de selección y dialogs ─────────────────────────────
  const [selectedEvaluacion, setSelectedEvaluacion] =
    useState<EvaluacionRendimientoResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // ── Solo evaluaciones del empleado autenticado ───────────────────────────
  const misEvaluaciones = useMemo(() => {
    if (!todasEvaluaciones || !user?.employeeId) return [];
    return todasEvaluaciones.filter((e) => e.empleadoId === user.employeeId);
  }, [todasEvaluaciones, user?.employeeId]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleViewDetails = (evaluacion: EvaluacionRendimientoResponse) => {
    setSelectedEvaluacion(evaluacion);
    setDetailsOpen(true);
  };

  // Desde la tabla — abre approve directo sin pasar por details
  const handleAprobarFromTable = (
    evaluacion: EvaluacionRendimientoResponse,
  ) => {
    setSelectedEvaluacion(evaluacion);
    setApproveOpen(true);
  };

  // Desde la tabla — abre reject directo sin pasar por details
  const handleRechazarFromTable = (
    evaluacion: EvaluacionRendimientoResponse,
  ) => {
    setSelectedEvaluacion(evaluacion);
    setRejectOpen(true);
  };

  // Al confirmar aprobar o rechazar — cierra todo
  const handleActionSuccess = () => {
    setDetailsOpen(false);
    setApproveOpen(false);
    setRejectOpen(false);
    setSelectedEvaluacion(null);
  };

  // ── Columnas ─────────────────────────────────────────────────────────────
  const columns = useMemo(
    () =>
      createEmpleadoColumns({
        onViewDetails: handleViewDetails,
        onAprobar: handleAprobarFromTable,
        onRechazar: handleRechazarFromTable,
      }),
    [],
  );

  const table = useReactTable({
    data: misEvaluaciones,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando tus evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">
            Error al cargar las evaluaciones.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <ClipboardList className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mis Evaluaciones
          </h1>
          <p className="text-muted-foreground text-sm">
            Consulta y gestiona tus evaluaciones de rendimiento.
          </p>
        </div>
      </div>

      {/* ── Tarjetas de resumen ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(
          [
            { label: "Total", estado: null, color: "bg-muted/50" },
            {
              label: "Pendientes",
              estado: "PENDIENTE",
              color: "bg-yellow-50 dark:bg-yellow-950/20",
            },
            {
              label: "Aprobadas",
              estado: "APROBADA",
              color: "bg-green-50 dark:bg-green-950/20",
            },
            {
              label: "Anuladas",
              estado: "ANULADA",
              color: "bg-red-50 dark:bg-red-950/20",
            },
          ] as const
        ).map(({ label, estado, color }) => (
          <div key={label} className={`rounded-lg border p-4 ${color}`}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {label}
            </p>
            <p className="text-2xl font-bold mt-1">
              {estado === null
                ? misEvaluaciones.length
                : misEvaluaciones.filter((e) => e.estado === estado).length}
            </p>
          </div>
        ))}
      </div>

      {/* ── Barra de búsqueda ── */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          placeholder="Buscar por evaluador, fecha..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9"
        />
      </div>

      {/* ── Tabla ── */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {misEvaluaciones.length === 0
                    ? "No tienes evaluaciones registradas."
                    : "No se encontraron resultados para la búsqueda."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
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
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Dialogs ── */}
      <DetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        evaluacion={selectedEvaluacion}
      />

      <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        evaluacion={selectedEvaluacion}
        onSuccess={handleActionSuccess}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        evaluacion={selectedEvaluacion}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
