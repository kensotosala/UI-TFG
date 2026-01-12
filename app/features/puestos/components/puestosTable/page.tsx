"use client";

import { useState } from "react";
import { usePuestos } from "../../hooks/usePuestos";
import { columns as baseColumns } from "./columns";
import { Puesto } from "../../types";
import { PuestoDetailsDialog } from "./detail-dialog";
import { PuestoEditDialog } from "./edit-dialog";
import { usePuestoMutations } from "../../hooks/usePuestoMutation";
import { PuestoDeleteDialog } from "./delete-dialog";
import { Button } from "@/components/ui/button";
import { PuestoCreateDialog } from "./create-dialog";

export default function PuestosTable() {
  const { puestos } = usePuestos();
  const {
    createPuesto,
    updatePuesto,
    deletePuesto,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePuestoMutations();

  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  const handleVer = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenView(true);
  };

  const handleCreate = async (
    puesto: Omit<Puesto, "idPuesto" | "fechaCreacion" | "fechaModificacion">
  ) => {
    try {
      await createPuesto(puesto);
      setOpenCreate(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditar = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenEdit(true);
  };

  const handleEliminar = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenDelete(true);
  };

  const handleSave = async (puestoEditado: Puesto) => {
    try {
      await updatePuesto({
        id: puestoEditado.idPuesto,
        puesto: {
          idPuesto: puestoEditado.idPuesto,
          nombrePuesto: puestoEditado.nombrePuesto,
          descripcion: puestoEditado.descripcion,
          nivelJerarquico: puestoEditado.nivelJerarquico,
          salarioMinimo: puestoEditado.salarioMinimo,
          salarioMaximo: puestoEditado.salarioMaximo,
          estado: puestoEditado.estado,
        },
      });

      setOpenEdit(false);
      setSelectedPuesto(null);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = baseColumns(handleVer, handleEditar, handleEliminar);

  if (puestos.length === 0) {
    return <p className="text-center py-10">No hay puestos registrados.</p>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-semibold">Lista de Puestos</h1>

          <Button className="ml-auto" onClick={() => setOpenCreate(true)}>
            Agregar Puesto
          </Button>
        </div>
      </div>

      <PuestoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        puesto={selectedPuesto}
      />

      <PuestoEditDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        puesto={selectedPuesto}
        onSave={handleSave}
        isLoading={isUpdating}
      />

      <PuestoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedPuesto(null);
        }}
        puesto={selectedPuesto}
        isDeleting={isDeleting}
        onConfirm={async (id: number) => {
          try {
            await deletePuesto(id);
            setSelectedPuesto(null);
          } catch (error) {
            console.error(error);
          }
        }}
      />

      <PuestoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSave={handleCreate}
        isLoading={isCreating}
      />
    </>
  );
}
