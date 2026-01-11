"use client";
import { usePuestos } from "../../hooks/usePuestos";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function PuestosTable() {
  const { puestos } = usePuestos();

  if (puestos.length === 0) {
    return <p className="text-center py-10">No hay puestos registrados.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={puestos} />
    </div>
  );
}
