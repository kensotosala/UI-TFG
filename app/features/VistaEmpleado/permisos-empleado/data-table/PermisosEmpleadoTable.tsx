"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { usePermisosEmpleado } from "../hooks/usePermisoEmpleado";
import { Permiso, CrearPermisoDTO } from "@/app/features/permisos/types";
import { columns } from "./columns";
import { PermisoCreateDialog } from "./dialogs/SolicitarPermisoDialog";
import { PermisoDetailsDialog } from "./dialogs/VerPermisoDialog";
import { useAuthContext } from "@/components/providers/AuthProvider";

export function PermisosEmpleadoTable() {
  const { user } = useAuthContext();
  const { permisos, isLoading, solicitar, isSolicitando } =
    usePermisosEmpleado();

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);

  const handleCreate = async (data: {
    fechaPermiso: string;
    motivo: string;
    conGoceSalario: boolean;
  }) => {
    if (!user?.employeeId) return;

    const payload: CrearPermisoDTO = {
      empleadoId: user.employeeId,
      fechaPermiso: data.fechaPermiso,
      motivo: data.motivo,
      conGoceSalario: data.conGoceSalario,
    };

    solicitar(payload, {
      onSuccess: () => {
        setOpenCreate(false);
      },
    });
  };

  const handleVer = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenView(true);
  };

  const tableColumns = columns(handleVer);

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

  if (!permisos || permisos.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay solicitudes de permisos</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando una nueva solicitud
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primera Solicitud
        </Button>

        <PermisoCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Mis Permisos</h2>
          <p className="text-muted-foreground">
            Gestiona tus solicitudes de permiso
          </p>
        </div>
        <Button onClick={() => setOpenCreate(true)} disabled={isSolicitando}>
          Nueva Solicitud
        </Button>
      </div>

      <DataTable columns={tableColumns} data={permisos} />

      <PermisoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <PermisoDetailsDialog
        open={openView}
        onOpenChange={(open) => {
          setOpenView(open);
          if (!open) setSelectedPermiso(null);
        }}
        permiso={selectedPermiso}
      />
    </>
  );
}
