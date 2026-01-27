"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";

import { VacacionDetailsDialog } from "./dialogs/details-dialog";
import { VacacionDeleteDialog } from "./dialogs/delete-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useVacacionesEmpleado } from "../../hooks/useVacacionesEmpleado";
import { ListarVacacionesDTO } from "../../vacaciones.types";
import { columns } from "./columns-empleado-vacaciones";
import { VacacionCreateDialogEmpleado } from "./dialogs/VacacionCreateDialogEmpleado";

export function VacacionesEmpleadoTable() {
  const { vacaciones, isLoading, saldo, solicitar, cancelar, isCancelando } =
    useVacacionesEmpleado();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedVacacion, setSelectedVacacion] =
    useState<ListarVacacionesDTO | null>(null);

  const handleCreate = async (data: {
    fechaInicio: string;
    fechaFin: string;
  }) => {
    try {
      await solicitar(data);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cancelar(id);
      setOpenDelete(false);
      setSelectedVacacion(null);
    } catch (error) {
      console.error("Error al cancelar:", error);
      throw error;
    }
  };

  const handleVer = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenView(true);
  };

  const handleEliminar = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenDelete(true);
  };

  const tableColumns = columns(handleVer, handleEliminar);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!vacaciones || vacaciones.length === 0) {
    return (
      <div className="space-y-4">
        {saldo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">
                  Días disponibles: {saldo.diasDisponibles}
                </p>
                <p className="text-sm text-muted-foreground">
                  Acumulados: {saldo.diasAcumulados} | Disfrutados:{" "}
                  {saldo.diasDisfrutados}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">
            No tienes solicitudes de vacaciones
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Comienza creando tu primera solicitud
          </p>
          <Button onClick={() => setOpenCreate(true)}>
            Crear Primera Solicitud
          </Button>

          <VacacionCreateDialogEmpleado
            open={openCreate}
            onOpenChange={setOpenCreate}
            onCreate={handleCreate}
            saldo={saldo}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {saldo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Disponibles</p>
                  <p className="font-semibold text-primary text-lg">
                    {saldo.diasDisponibles}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Acumulados</p>
                  <p className="font-semibold">{saldo.diasAcumulados}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Disfrutados</p>
                  <p className="font-semibold">{saldo.diasDisfrutados}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mis Vacaciones</h2>
            <p className="text-muted-foreground">
              Gestiona tus solicitudes de vacaciones
            </p>
          </div>
          <Button onClick={() => setOpenCreate(true)}>Nueva Solicitud</Button>
        </div>

        <DataTable columns={tableColumns} data={vacaciones} />
      </div>

      <VacacionCreateDialogEmpleado
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
        saldo={saldo}
      />

      <VacacionDetailsDialog
        open={openView}
        onOpenChange={(open) => {
          setOpenView(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
      />

      <VacacionDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
        isDeleting={isCancelando}
        onConfirm={handleDelete}
      />
    </>
  );
}
