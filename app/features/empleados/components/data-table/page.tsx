/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import TableHeader from "@/components/TableHeader";

import { Empleado } from "../../types";
import { columns } from "./columns";
import { EmpleadoCreateDialog } from "./dialogs/create-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { EmpleadoDetailsDialog } from "./dialogs/detail-dialog";
import { EmpleadoEditDialog } from "./dialogs/edit-dialog";
import { EmpleadoDeleteDialog } from "./dialogs/delete-dialog";
import { useEmpleados } from "../../hooks/useEmpleado";
import { useEmpleadoMutations } from "../../hooks/useEmpleadosMutation";

export function EmpleadosTable() {
  const { empleados, isLoading, refetch } = useEmpleados();
  const {
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    isUpdating,
    isDeleting,
  } = useEmpleadoMutations();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );

  const handleCreate = async (empleadoData: any) => {
    try {
      await createEmpleado({
        ...empleadoData,
        estado: "ACTIVO",
      });
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear empleado:", error);
    }
  };

  const handleEdit = async (empleado: Empleado) => {
    if (empleado.idEmpleado === undefined) {
      console.error("El empleado no tiene un id válido");
      return;
    }

    await updateEmpleado({
      id: empleado.idEmpleado,
      data: {
        nombre: empleado.nombre,
        primerApellido: empleado.primerApellido,
        segundoApellido: empleado.segundoApellido,
        email: empleado.email,
        telefono: empleado.telefono,
        estado: empleado.estado,
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
      setOpenDelete(false);
      setSelectedEmpleado(null);
      refetch();
    } catch (error) {
      console.log("Error al eliminar empleado:", error);
    }
  };

  const handleVer = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenView(true);
  };

  const handleEditar = (empleado: Empleado) => {
    if (!empleado.idEmpleado) {
      console.error("Empleado seleccionado no tiene un id válido");
      return;
    }
    setSelectedEmpleado(empleado);
    setOpenEdit(true);
  };

  const handleEliminar = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenDelete(true);
  };

  const tableColumns = columns(handleVer, handleEditar, handleEliminar);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay empleados registrados</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo empleado
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Empleado
        </Button>

        <EmpleadoCreateDialog
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
        title="Empleados"
        entity="Empleado"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={empleados} />

      {/* DIÁLOGOS */}
      <EmpleadoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <EmpleadoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        empleado={selectedEmpleado}
      />

      <EmpleadoEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        onSave={handleEdit}
        isLoading={isUpdating}
      />

      <EmpleadoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
