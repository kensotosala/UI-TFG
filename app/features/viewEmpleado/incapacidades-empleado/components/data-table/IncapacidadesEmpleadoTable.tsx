"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIncapacidadesEmpleado } from "../../hooks/useIncapacidadesEmpleado";
import { Incapacidad } from "../../types";
import { columns } from "./columns-empleado-incapacidades";
import { IncapacidadCreateDialogEmpleado } from "./dialogs/IncapacidadCreateDialogEmpleado";
import { DataTable } from "./data-table-incapacidades";
import { IncapacidadDetailsDialog } from "./dialogs/details-dialog";
import { IncapacidadDeleteDialogEmpleado } from "./dialogs/IncapacidadDeleteDialogEmpleado";

export function IncapacidadesEmpleadoTable() {
  const { incapacidades, isLoading, registrar, eliminar, isEliminando } =
    useIncapacidadesEmpleado();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedIncapacidad, setSelectedIncapacidad] =
    useState<Incapacidad | null>(null);

  const handleCreate = async (data: {
    diagnostico: string;
    fechaInicio: string;
    fechaFin: string;
    tipoIncapacidad: string;
    archivoAdjunto: string | null;
  }) => {
    try {
      await registrar(data);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error al crear incapacidad:", error);
      throw error;
    }
  };

  const handleVer = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenView(true);
  };

  const handleEliminar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenDelete(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminar(id);
      setOpenDelete(false);
      setSelectedIncapacidad(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      throw error;
    }
  };

  const tableColumns = columns(handleVer, handleEliminar);

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

  if (!incapacidades || incapacidades.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No tienes registros de incapacidades
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comienza creando tu primer registro
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Registro
        </Button>

        <IncapacidadCreateDialogEmpleado
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Mis Incapacidades</h2>
          <p className="text-muted-foreground">
            Gestiona tus registros de incapacidad
          </p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>Nuevo Registro</Button>
      </div>

      <DataTable columns={tableColumns} data={incapacidades} />

      <IncapacidadCreateDialogEmpleado
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <IncapacidadDetailsDialog
        open={openView}
        onOpenChange={(open) => {
          setOpenView(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
      />

      <IncapacidadDeleteDialogEmpleado
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        isDeleting={isEliminando}
        onConfirm={handleDelete}
      />
    </>
  );
}
