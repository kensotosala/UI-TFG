/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import PuestosTable from "@/app/features/puestos/components/puestosTable/page";
import TableHeader from "@/components/TableHeader";
import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";
import { CreatePuestoDialog } from "@/app/features/puestos/components/puestosTable/create-dialog";

const PuestosPage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const { createPuesto } = usePuestos();

  const handleCreate = async (puestoData: any) => {
    try {
      await createPuesto({
        ...puestoData,
        estado: true, // Por defecto activo
      });
    } catch (error) {
      console.error("Error al crear puesto:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <TableHeader
        title="Puestos"
        entity="Puesto"
        onAddClick={() => setOpenCreate(true)}
      />

      <div className="mt-6">
        <PuestosTable />
      </div>

      <CreatePuestoDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default PuestosPage;
