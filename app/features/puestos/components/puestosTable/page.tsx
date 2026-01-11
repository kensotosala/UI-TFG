"use client";

import { useState } from "react";
import { usePuestos } from "../../hooks/usePuestos";
import { columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { Puesto } from "../../types";
import { PuestoDetailsDialog } from "./detail-dialog";
import { PuestoEditDialog } from "./edit-dialog";
import { usePuestoMutations } from "../../hooks/usePuestoMutation";
import { PuestoDeleteDialog } from "./delete-dialog";

export default function PuestosTable() {
  const { puestos } = usePuestos();
  const { updatePuesto, deletePuesto, isUpdating, isDeleting } =
    usePuestoMutations();

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  const handleVer = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenView(true);
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
        <DataTable columns={columns} data={puestos} />
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
    </>
  );
}
