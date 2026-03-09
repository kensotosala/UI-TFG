"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLiquidaciones } from "../../hooks/useLiquidaciones";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NuevaLiquidacionDialog } from "../dialogs/NuevaLiquidacionDialog";
import {
  CrearLiquidacionDTO,
  EditarLiquidacionDTO,
  LiquidacionDTO,
} from "../../types";
import TableHeader from "@/components/TableHeader";
import { VerDetallesLiquidacion } from "../dialogs/VerDetallesLiquidacionDialog";
import { AnularLiquidacionDialog } from "../dialogs/AnularLiquidacionDialog";
import EditarLiquidacionDialog from "../dialogs/EditarLiquidacionDialog";

export default function LiquidacionesTable() {
  const {
    liquidaciones,
    isLoading,
    isError,
    crear,
    anular,
    isAnulando,
    editar,
  } = useLiquidaciones();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedLiquidacion, setSelectedLiquidacion] =
    useState<LiquidacionDTO | null>(null);

  const handleCreate = async (data: CrearLiquidacionDTO) => {
    try {
      await crear(data);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error al crear liquidación:", error);
      throw error;
    }
  };

  const handleVer = (liquidacion: LiquidacionDTO) => {
    setSelectedLiquidacion(liquidacion);
    setOpenView(true);
  };

  const handleEditar = (liquidacion: LiquidacionDTO) => {
    setSelectedLiquidacion(liquidacion);
    setOpenEdit(true);
  };

  const handleConfirmarEdicion = async (payload: EditarLiquidacionDTO) => {
    try {
      await editar(payload);
      setOpenEdit(false);
    } catch (error) {
      console.error("Error al editar liquidación:", error);
      throw error;
    }
  };

  const handleEliminar = (liquidacion: LiquidacionDTO) => {
    setSelectedLiquidacion(liquidacion);
    setOpenDelete(true);
  };

  const handleAnular = async (id: number) => {
    try {
      await anular(id);
      setOpenDelete(false);
    } catch (error) {
      console.error("Error al anular liquidación:", error);
      throw error;
    }
  };

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

  return (
    <>
      {!liquidaciones || liquidaciones.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">
            No hay registros de liquidaciones
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Comience creando un nuevo registro
          </p>
          <Button onClick={() => setOpenCreate(true)}>
            Crear Primer Registro
          </Button>
        </div>
      ) : (
        <>
          <TableHeader
            title="Liquidaciones"
            entity="Liquidación"
            onAddClick={() => setOpenCreate(true)}
          />
          <div className="container mx-auto py-10">
            <DataTable
              columns={columns(handleVer, handleEditar, handleEliminar)}
              data={liquidaciones}
            />
          </div>
        </>
      )}

      <NuevaLiquidacionDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <VerDetallesLiquidacion
        open={openView}
        onOpenChange={setOpenView}
        data={selectedLiquidacion}
      />

      <AnularLiquidacionDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        data={selectedLiquidacion}
        isDeleting={isAnulando}
        onConfirm={handleAnular}
      />

      <EditarLiquidacionDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        data={selectedLiquidacion}
        onEdit={handleConfirmarEdicion}
      />
    </>
  );
}
