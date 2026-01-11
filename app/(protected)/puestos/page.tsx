"use client";

import PuestosTable from "@/app/features/puestos/components/puestosTable/page";
import TableHeader from "@/components/TableHeader";

const PuestosPage = () => {
  return (
    <div className="container mx-auto py-2 overflow-x-visible">
      <TableHeader title="Puestos" entity="Puesto" />
      <PuestosTable />
    </div>
  );
};

export default PuestosPage;
