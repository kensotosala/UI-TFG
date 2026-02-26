"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/features/asistencia/components/asistencia-table/data-table";
import { AsistenciaDetailsDialog } from "@/app/features/asistencia/components/asistencia-table/dialogs/detail-dialog";
import { AsistenciaDetallada } from "@/app/features/asistencia/types";
import { columnsEmpleado } from "./columns-empleado";
import { useAsistenciasEmpleado } from "../../hooks/use-asistencia-empleado";

export function AsistenciasEmpleadoTable() {
  const { asistencias, isLoading } = useAsistenciasEmpleado();
  const [openView, setOpenView] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] =
    useState<AsistenciaDetallada | null>(null);

  const handleVer = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenView(true);
  };

  const tableColumns = columnsEmpleado(handleVer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No tienes asistencias registradas
        </h3>
        <p className="text-muted-foreground mt-2">
          Tus registros de asistencia aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mis Asistencias</h1>
        <div className="flex gap-2">
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      <DataTable columns={tableColumns} data={asistencias} />

      <AsistenciaDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        asistencia={selectedAsistencia}
      />
    </div>
  );
}
