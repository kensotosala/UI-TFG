"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClipboardList, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { EvaluacionesDataTable } from "./data-table";
import { CreateEvaluacionDialog } from "./dialogs/create-dialog";
import { EditEvaluacionDialog } from "./dialogs/edit-dialog";
import { DeleteEvaluacionDialog } from "./dialogs/delete-dialog";
import { DetailsEvaluacionDialog } from "./dialogs/details-dialog";
import { useEvaluacionesRendimiento } from "../../hooks/useEvaluacionesRendimiento";
import type { EvaluacionRendimientoResponse } from "../../types";

// Component

export default function EvaluacionesRendimientoTable() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useEvaluacionesRendimiento();

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Evaluaciones de Rendimiento
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona las evaluaciones anuales de desempeño de los empleados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          {/* Create */}
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
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
