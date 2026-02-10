"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";

import {
  AsistenciaDetallada,
  CrearAsistenciaDTO,
  ActualizarAsistenciaDTO,
  FiltrosAsistencia,
} from "../../types";
import { useAsistencias } from "../../hooks/useAsistencia";
import { AsistenciaCreateDialog } from "./dialogs/create-dialog";
import { AsistenciaDetailsDialog } from "./dialogs/detail-dialog";
import { AsistenciaEditDialog } from "./dialogs/edit-dialog";
import { AsistenciaDeleteDialog } from "./dialogs/delete-dialog";
import { AsistenciaJustificarDialog } from "./dialogs/justify-dialog";
import { columns } from "./columns";

export function AsistenciasTable() {
  const [filtros] = useState<FiltrosAsistencia>({
    page: 1,
    limit: 20,
  });

  const {
    asistencias,
    isLoading,
    refetch,
    crearAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    justificarAsistencia,
    aprobarJustificacion,
    isUpdating,
    isDeleting,
  } = useAsistencias(filtros);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openJustificar, setOpenJustificar] = useState(false);

  const [selectedAsistencia, setSelectedAsistencia] =
    useState<AsistenciaDetallada | null>(null);

  const handleCreate = async (data: CrearAsistenciaDTO) => {
    try {
      await crearAsistencia(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear asistencia:", error);
    }
  };

  const handleEdit = async (id: string, data: ActualizarAsistenciaDTO) => {
    try {
      await actualizarAsistencia({ id, data });
      setOpenEdit(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al editar asistencia:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarAsistencia(id);
      setOpenDelete(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
    }
  };

  const handleJustificar = async (
    id: string,
    justificacion: {
      tipo: string;
      descripcion: string;
      documentoUrl?: string;
    },
  ) => {
    try {
      await justificarAsistencia({ id, justificacion });
      setOpenJustificar(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al justificar:", error);
    }
  };

  const handleAprobar = async (asistencia: AsistenciaDetallada) => {
    try {
      await aprobarJustificacion(asistencia.id);
      refetch();
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const handleVer = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenView(true);
  };

  const handleEditar = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenEdit(true);
  };

  const handleEliminar = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenDelete(true);
  };

  const handleJustificarClick = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenJustificar(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    handleJustificarClick,
    handleAprobar,
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay registros de asistencia</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience registrando una nueva asistencia
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Registrar Primera Asistencia
        </Button>

        <AsistenciaCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <TableHeader
        title="Asistencias"
        entity="Asistencia"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={asistencias} />

      {/* DIÁLOGOS */}
      <AsistenciaCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <AsistenciaDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        asistencia={selectedAsistencia}
      />

      <AsistenciaEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistencia={selectedAsistencia}
        onUpdate={handleEdit}
      />

      <AsistenciaDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistencia={selectedAsistencia}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />

      <AsistenciaJustificarDialog
        open={openJustificar}
        onOpenChange={(open) => {
          setOpenJustificar(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistenciaId={selectedAsistencia?.id || ""}
        empleadoNombre={
          typeof selectedAsistencia?.empleado === "string"
            ? selectedAsistencia.empleado
            : selectedAsistencia?.empleado?.nombre || ""
        }
        onSave={handleJustificar}
        isLoading={isUpdating}
      />
    </>
  );
}
