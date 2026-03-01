"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLiquidaciones } from "../../hooks/useLiquidaciones";
import { Skeleton } from "@/components/ui/skeleton";

export default function LiquidacionesTable() {
  const { liquidaciones, isLoading, isError } = useLiquidaciones();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-24 text-center text-red-500">
        Ocurrió un error al cargar las liquidaciones.
      </div>
    );
  }

  if (!liquidaciones.length) {
    return (
      <div className="h-24 text-center">No existen datos para mostrar.</div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={liquidaciones} />
    </div>
  );
}
