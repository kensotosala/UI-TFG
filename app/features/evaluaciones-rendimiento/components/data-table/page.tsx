"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ClipboardList,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { EvaluacionesDataTable } from "./data-table";
import { CreateEvaluacionDialog } from "./dialogs/create-dialog";
import { EditEvaluacionDialog } from "./dialogs/edit-dialog";
import { DeleteEvaluacionDialog } from "./dialogs/delete-dialog";
import { DetailsEvaluacionDialog } from "./dialogs/details-dialog";
import { useEvaluacionesRendimiento } from "../../hooks/useEvaluacionesRendimiento";
import type { EvaluacionRendimientoResponse } from "../../types";
import { EvaluacionesPDF } from "@/app/features/generar-reportes/components/templates/evaluaciones-pdf";
import { useAuthContext } from "@/components/providers/AuthProvider";

// Feature para Exportar en PDF, Excel o CSV
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `evaluaciones-${date}.${ext}`;
}

function buildSheetData(evaluaciones: EvaluacionRendimientoResponse[]) {
  return evaluaciones.map((obj) => ({
    ID: obj.idEvaluacion,
    "ID Empleado": obj.empleadoId,
    "Nombre Empleado": obj.nombreEmpleado,
    "Fecha Inicio": obj.fechaInicio,
    "Fecha Fin": obj.fechaFin,
    Evaluador: obj.evaluadorId,
    "Nombre Evaluador": obj.nombreEvaluador,
    "Puntuacion Total": obj.puntuacionTotal,
    Comentarios: obj.comentarios,
    Estado: obj.estado,
    "Fecha Creacion": obj.fechaCreacion,
    "Fecha Modificacion": obj.fechaModificacion,
    Detalles: obj.detalles,
  }));
}

function exportToExcel(evaluaciones: EvaluacionRendimientoResponse[]): void {
  const data = buildSheetData(evaluaciones);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "evaluaciones");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(evaluaciones: EvaluacionRendimientoResponse[]): void {
  const data = buildSheetData(evaluaciones);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getFileName("csv");
  link.click();
  URL.revokeObjectURL(url);
}

export default function EvaluacionesRendimientoTable() {
  const { data, isLoading, isError, error, refetch } =
    useEvaluacionesRendimiento();

  const { checkRole } = useAuthContext();

  // Estado de dialogs
  const [createOpen, setCreateOpen] = useState(false);

  const [selectedEvaluacion, setSelectedEvaluacion] =
    useState<EvaluacionRendimientoResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Handlers
  const handleView = useCallback(
    (evaluacion: EvaluacionRendimientoResponse) => {
      setSelectedEvaluacion(evaluacion);
      setDetailsOpen(true);
    },
    [],
  );

  const handleEdit = useCallback(
    (evaluacion: EvaluacionRendimientoResponse) => {
      setSelectedEvaluacion(evaluacion);
      setEditOpen(true);
    },
    [],
  );

  const handleDelete = useCallback(
    (evaluacion: EvaluacionRendimientoResponse) => {
      setSelectedEvaluacion(evaluacion);
      setDeleteOpen(true);
    },
    [],
  );

  const handleEditOpenChange = useCallback((open: boolean) => {
    setEditOpen(open);
    if (!open) setSelectedEvaluacion(null);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    setDeleteOpen(open);
    if (!open) setSelectedEvaluacion(null);
  }, []);

  const handleDetailsOpenChange = useCallback((open: boolean) => {
    setDetailsOpen(open);
    if (!open) setSelectedEvaluacion(null);
  }, []);

  // Render

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Mis Evaluaciones
            </h1>
            <p className="text-muted-foreground text-sm">
              Consulta y gestiona tus evaluaciones.
            </p>
          </div>
        </div>

        {checkRole("ADMIN") && (
          <div className="flex-1 flex justify-end">
            <Button
              style={{ backgroundColor: "#052940" }}
              onClick={() => setCreateOpen(true)}
            >
              Nueva Evaluación
            </Button>
          </div>
        )}

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Exportar
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Selecciona un formato
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <PDFDownloadLink
                document={<EvaluacionesPDF evaluaciones={data ?? []} />}
                fileName={getFileName("pdf")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {({ loading }) => (
                  <DropdownMenuItem
                    disabled={loading}
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-red-500" />
                    <span>{loading ? "Generando..." : "Exportar PDF"}</span>
                  </DropdownMenuItem>
                )}
              </PDFDownloadLink>

              <DropdownMenuItem
                onSelect={() => exportToExcel(data ?? [])}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => exportToCSV(data ?? [])}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contenido */}

      {/* Estado de carga inicial */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-64 w-full rounded-md" />
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      )}

      {/* Estado de error */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar evaluaciones</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>
              {(error as Error)?.message ??
                "No se pudo conectar con el servidor. Intenta de nuevo."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="shrink-0"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabla de datos */}
      {!isLoading && !isError && data && (
        <>
          <EvaluacionesDataTable
            data={data}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Dialogs */}

      <CreateEvaluacionDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditEvaluacionDialog
        open={editOpen}
        onOpenChange={handleEditOpenChange}
        evaluacion={selectedEvaluacion}
      />

      <DeleteEvaluacionDialog
        open={deleteOpen}
        onOpenChange={handleDeleteOpenChange}
        evaluacion={selectedEvaluacion}
      />

      <DetailsEvaluacionDialog
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
        evaluacion={selectedEvaluacion}
      />
    </div>
  );
}
