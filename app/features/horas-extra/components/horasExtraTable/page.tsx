"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  HoraExtra,
  CrearHoraExtraDTO,
  ActualizarHoraExtraDTO,
  AprobarRechazarHoraExtraDTO,
  EstadoSolicitud,
} from "../../types";
import { useHorasExtra } from "../../hooks/useHorasExtra";
import { HoraExtraCreateDialog } from "./dialogs/create-dialog";
import { HoraExtraDetailsDialog } from "./dialogs/details-dialog";
import { HoraExtraEditDialog } from "./dialogs/edit-dialog";
import { HoraExtraDeleteDialog } from "./dialogs/delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

export function HorasExtraTable() {
  const {
    horasExtras,
    isLoading,
    refetch,
    createHoraExtra,
    updateHoraExtra,
    deleteHoraExtra,
    aprobarRechazarHoraExtra,
    isDeleting,
  } = useHorasExtra();

  const { empleados } = useEmpleados();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAprobar, setOpenAprobar] = useState(false);
  const [openRechazar, setOpenRechazar] = useState(false);

  const [selectedHoraExtra, setSelectedHoraExtra] = useState<HoraExtra | null>(
    null
  );
  const [jefeAprobador, setJefeAprobador] = useState<number | null>(null);

  const handleCreate = async (data: CrearHoraExtraDTO) => {
    try {
      await createHoraExtra(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear hora extra:", error);
    }
  };

  const handleEdit = async (id: number, data: ActualizarHoraExtraDTO) => {
    try {
      await updateHoraExtra({ id, data });
      setOpenEdit(false);
      setSelectedHoraExtra(null);
      refetch();
    } catch (error) {
      console.error("Error al editar hora extra:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHoraExtra(id);
      setOpenDelete(false);
      setSelectedHoraExtra(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar hora extra:", error);
    }
  };

  const handleAprobar = async () => {
    if (!selectedHoraExtra || !jefeAprobador) {
      alert("Debe seleccionar un jefe aprobador");
      return;
    }

    try {
      const dto: AprobarRechazarHoraExtraDTO = {
        estadoSolicitud: EstadoSolicitud.APROBADA,
        jefeApruebaId: jefeAprobador,
      };

      await aprobarRechazarHoraExtra({
        id: selectedHoraExtra.idHoraExtra,
        data: dto,
      });

      setOpenAprobar(false);
      setSelectedHoraExtra(null);
      setJefeAprobador(null);
      refetch();
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const handleRechazar = async () => {
    if (!selectedHoraExtra || !jefeAprobador) {
      alert("Debe seleccionar un jefe aprobador");
      return;
    }

    try {
      const dto: AprobarRechazarHoraExtraDTO = {
        estadoSolicitud: EstadoSolicitud.RECHAZADA,
        jefeApruebaId: jefeAprobador,
      };

      await aprobarRechazarHoraExtra({
        id: selectedHoraExtra.idHoraExtra,
        data: dto,
      });

      setOpenRechazar(false);
      setSelectedHoraExtra(null);
      setJefeAprobador(null);
      refetch();
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
  };

  const handleVer = (horaExtra: HoraExtra) => {
    setSelectedHoraExtra(horaExtra);
    setOpenView(true);
  };

  const handleEditar = (horaExtra: HoraExtra) => {
    setSelectedHoraExtra(horaExtra);
    setOpenEdit(true);
  };

  const handleEliminar = (horaExtra: HoraExtra) => {
    setSelectedHoraExtra(horaExtra);
    setOpenDelete(true);
  };

  const handleAprobarClick = (horaExtra: HoraExtra) => {
    setSelectedHoraExtra(horaExtra);
    setOpenAprobar(true);
  };

  const handleRechazarClick = (horaExtra: HoraExtra) => {
    setSelectedHoraExtra(horaExtra);
    setOpenRechazar(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    handleAprobarClick,
    handleRechazarClick
  );

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

  if (horasExtras.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay solicitudes de horas extra
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando una nueva solicitud
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primera Solicitud
        </Button>

        <HoraExtraCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <TableHeader
        title="Horas Extra"
        entity="Solicitud"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={horasExtras} />

      {/* DIÁLOGOS */}
      <HoraExtraCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <HoraExtraDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        horaExtra={selectedHoraExtra}
      />

      <HoraExtraEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedHoraExtra(null);
        }}
        horaExtra={selectedHoraExtra}
        onUpdate={handleEdit}
      />

      <HoraExtraDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedHoraExtra(null);
        }}
        horaExtra={selectedHoraExtra}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Diálogo de Aprobación */}
      <Dialog
        open={openAprobar}
        onOpenChange={(open) => {
          setOpenAprobar(open);
          if (!open) {
            setSelectedHoraExtra(null);
            setJefeAprobador(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              Seleccione el jefe que aprueba esta solicitud de horas extra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="jefeAprobador">Jefe Aprobador *</Label>
              <Select
                value={jefeAprobador?.toString() || ""}
                onValueChange={(value) => setJefeAprobador(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un jefe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jefes</SelectLabel>
                    {empleados.map((empleado) => (
                      <SelectItem
                        key={empleado.idEmpleado}
                        value={empleado.idEmpleado.toString()}
                      >
                        {empleado.nombre} {empleado.primerApellido}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenAprobar(false);
                setJefeAprobador(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAprobar} disabled={!jefeAprobador}>
              Aprobar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Rechazo */}
      <Dialog
        open={openRechazar}
        onOpenChange={(open) => {
          setOpenRechazar(open);
          if (!open) {
            setSelectedHoraExtra(null);
            setJefeAprobador(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Seleccione el jefe que rechaza esta solicitud de horas extra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="jefeAprobador">Jefe que Rechaza *</Label>
              <Select
                value={jefeAprobador?.toString() || ""}
                onValueChange={(value) => setJefeAprobador(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un jefe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jefes</SelectLabel>
                    {empleados.map((empleado) => (
                      <SelectItem
                        key={empleado.idEmpleado}
                        value={empleado.idEmpleado.toString()}
                      >
                        {empleado.nombre} {empleado.primerApellido}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenRechazar(false);
                setJefeAprobador(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRechazar}
              disabled={!jefeAprobador}
            >
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
