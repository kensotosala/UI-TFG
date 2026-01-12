/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import TableHeader from "@/components/TableHeader";

export function DepartamentosTable() {
  const { departamentos, isLoading, refetch } = useDepartamentosQuery();
  const {
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    isUpdating,
    isDeleting,
  } = useDepartamentoMutations();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] =
    useState<Departamento | null>(null);

  const handleCreate = async (departamentoData: any) => {
    try {
      await createDepartamento({
        ...departamentoData,
        estado: "ACTIVO",
      });
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear departamento:", error);
    }
  };

  const handleEdit = async (departamento: Departamento) => {
    try {
      await updateDepartamento(departamento.idDepartamento, {
        nombreDepartamento: departamento.nombreDepartamento,
        descripcion: departamento.descripcion,
        idJefeDepartamento: departamento.idJefeDepartamento,
        estado: departamento.estado,
      });
      setOpenEdit(false);
      setSelectedDepartamento(null);
      refetch();
    } catch (error) {
      console.error("Error al editar departamento:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartamento(id);
      setOpenDelete(false);
      setSelectedDepartamento(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
    }
  };

  const handleVer = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setOpenView(true);
  };

  const handleEditar = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setOpenEdit(true);
  };

  const handleEliminar = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
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

  if (departamentos.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay departamentos registrados
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo departamento
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Departamento
        </Button>

        <DepartamentoCreateDialog
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
        title="Departamentos"
        entity="Departamento"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={departamentos} />

      {/* DIÁLOGOS */}
      <DepartamentoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <DepartamentoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        departamento={selectedDepartamento}
      />

      <DepartamentoEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedDepartamento(null);
        }}
        departamento={selectedDepartamento}
        onSave={handleEdit}
        isLoading={isUpdating}
      />

      <DepartamentoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedDepartamento(null);
        }}
        departamento={selectedDepartamento}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
