"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

import { IncapacidadCreateDialog } from "./dialogs/create-dialog";
import { IncapacidadDetailsDialog } from "./dialogs/details-dialog";

import { IncapacidadDeleteDialog } from "./dialogs/delete-dialog";
import { useIncapacidad } from "../../hooks/useIncapacidad";
import { IncapacidadUpdateDialog } from "./dialogs/edit-dialog";
import { IncapacidadesPDF } from "@/app/features/generar-reportes/components/templates/incapacidades-pdf";
import { FileDown, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import {
  ActualizarIncapacidadDTO,
  Incapacidad,
  RegistrarIncapacidadDTO,
} from "../../types";

function calcularDias(fechaInicio: string, fechaFin: string): number {
  try {
    const diff = new Date(fechaFin).getTime() - new Date(fechaInicio).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return 0;
  }
}

// Feature para exportar reportes
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `incapacidades-${date}.${ext}`;
}

function buildSheetData(incapacidades: Incapacidad[]) {
  return incapacidades.map((i) => ({
    Diagnóstico: i.diagnostico,
    "Fecha Inicio": i.fechaInicio,
    "Fecha Fin": i.fechaFin,
    Tipo: i.tipoIncapacidad,
    Días: calcularDias(i.fechaInicio, i.fechaFin),
    Estado: i.estado,
  }));
}

function exportToExcel(incapacidades: Incapacidad[]): void {
  const data = buildSheetData(incapacidades);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Incapacidades");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(incapacidades: Incapacidad[]): void {
  const data = buildSheetData(incapacidades);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getFileName("csv");
  link.click();
  URL.revokeObjectURL(url);
}

export function IncapacidadesTable() {
  const {
    incapacidades,
    isLoading,
    refetch,
    registrarIncapacidad,
    actualizarIncapacidad,
    eliminarIncapacidad,
    isDeleting,
  } = useIncapacidad();

  const { empleados } = useEmpleados();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedIncapacidad, setSelectedIncapacidad] =
    useState<Incapacidad | null>(null);

  const handleCreate = async (data: RegistrarIncapacidadDTO) => {
    try {
      await registrarIncapacidad(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear incapacidad:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: ActualizarIncapacidadDTO) => {
    try {
      await actualizarIncapacidad(data);
      setOpenUpdate(false);
      setSelectedIncapacidad(null);
      refetch();
    } catch (error) {
      console.error("Error al actualizar incapacidad:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarIncapacidad(id);
      setOpenDelete(false);
      setSelectedIncapacidad(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar incapacidad:", error);
      throw error;
    }
  };

  const handleVer = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenView(true);
  };

  const handleEditar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenUpdate(true);
  };

  const handleEliminar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenDelete(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    empleados,
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

  if (!incapacidades || incapacidades.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay registros de incapacidades
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo registro
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Registro
        </Button>

        <IncapacidadCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between gap-3">
        <div className="flex-1">
          <TableHeader
            title="Incapacidades"
            entity="Incapacidad"
            onAddClick={() => setOpenCreate(true)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Exportar
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Selecciona un formato
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <PDFDownloadLink
              document={
                <IncapacidadesPDF
                  incapacidades={incapacidades}
                  isAdmin={true}
                />
              }
              fileName={getFileName("pdf")}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ loading }) => (
                <DropdownMenuItem
                  disabled={loading}
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-red-500" />
                  <span>{loading ? "Generando..." : "Exportar PDF"}</span>
                </DropdownMenuItem>
              )}
            </PDFDownloadLink>

            <DropdownMenuItem
              onSelect={() => exportToExcel(incapacidades)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>Exportar Excel</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => exportToCSV(incapacidades)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-blue-500" />
              <span>Exportar CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable columns={tableColumns} data={incapacidades} />

      {/* DIÁLOGOS */}
      <IncapacidadCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <IncapacidadDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        incapacidad={selectedIncapacidad}
      />

      <IncapacidadUpdateDialog
        open={openUpdate}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenUpdate(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        onUpdate={handleUpdate}
      />

      <IncapacidadDeleteDialog
        open={openDelete}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenDelete(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
