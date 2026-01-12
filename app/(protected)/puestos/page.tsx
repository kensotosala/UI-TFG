"use client";

import { PuestoCreateDialog } from "@/app/features/puestos/components/puestosTable/create-dialog";
import PuestosTable from "@/app/features/puestos/components/puestosTable/page";
import TableHeader from "@/components/TableHeader";
import { useState } from "react";

const PuestosPage = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const handleAddClick = () => {
    setOpenCreate(true);
  };

  return (
    <div className="container mx-auto py-2 overflow-x-visible">
      <TableHeader
        title="Puestos"
        entity="Puesto"
        onAddClick={handleAddClick}
      />

      <PuestosTable />

      {/* Diálogo de creación */}
      <PuestoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSave={async (puesto) => {
          console.log("Crear puesto:", puesto);
          setOpenCreate(false);
        }}
      />
    </div>
  );
};

export default PuestosPage;
