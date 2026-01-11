"use client";

import { useState } from "react";
import { usePuestos } from "../../hooks/usePuestos";
import { columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { Puesto } from "../../types";
import { PuestoDetailsDialog } from "./detail-dialog";
import { PuestoEditDialog } from "./edit-dialog";

export default function PuestosTable() {
  const { puestos } = usePuestos();

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  const handleVer = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenView(true);
  };

  const handleEditar = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenEdit(true);
  };

  const handleSave = (puestoEditado: Puesto) => {
    console.log("Guardar en backend:", puestoEditado);
    setOpenEdit(false);
  };

  const columns = baseColumns(handleVer, handleEditar);

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
      />
    </>
  );
}
