"use client";

import { useState } from "react";
import { usePuestos } from "../../hooks/usePuestos";
import { columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { Puesto } from "../../types";
import { PuestoDetailsDialog } from "./detail-dialog";

export default function PuestosTable() {
  const { puestos } = usePuestos();

  const [open, setOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  const handleVerPuesto = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpen(true);
  };

  const columns = baseColumns(handleVerPuesto);

  if (puestos.length === 0) {
    return <p className="text-center py-10">No hay puestos registrados.</p>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={puestos} />
      </div>

      <PuestoDetailsDialog
        open={open}
        onOpenChange={setOpen}
        puesto={selectedPuesto}
      />
    </>
  );
}
