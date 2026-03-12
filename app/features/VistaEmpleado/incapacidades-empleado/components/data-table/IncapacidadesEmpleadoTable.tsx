"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { FileText, FileSpreadsheet, FileDown, ChevronDown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIncapacidadesEmpleado } from "../../hooks/useIncapacidadesEmpleado";
import { Incapacidad } from "../../types";
import { columns } from "./columns-empleado-incapacidades";
import { IncapacidadCreateDialogEmpleado } from "./dialogs/IncapacidadCreateDialogEmpleado";
import { DataTable } from "./data-table-incapacidades";
import { IncapacidadDetailsDialog } from "./dialogs/details-dialog";
import { IncapacidadDeleteDialogEmpleado } from "./dialogs/IncapacidadDeleteDialogEmpleado";
import { IncapacidadesPDF } from "@/app/features/generar-reportes/components/templates/incapacidades-pdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

// ── Helpers ──────────────────────────────────────────

function calcularDias(fechaInicio: string, fechaFin: string): number {
  try {
    const diff = new Date(fechaFin).getTime() - new Date(fechaInicio).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return 0;
  }
}

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

// ── Componente ────────────────────────────────────────

export function IncapacidadesEmpleadoTable() {
  const { incapacidades, isLoading, registrar, eliminar, isEliminando } =
    useIncapacidadesEmpleado();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedIncapacidad, setSelectedIncapacidad] =
    useState<Incapacidad | null>(null);

  const handleCreate = async (data: {
    diagnostico: string;
    fechaInicio: string;
    fechaFin: string;
    tipoIncapacidad: string;
    archivo?: File;
  }) => {
    try {
      await registrar(data);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error al crear incapacidad:", error);
      throw error;
    }
  };

  const handleVer = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenView(true);
  };

  const handleEliminar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenDelete(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminar(id);
      setOpenDelete(false);
      setSelectedIncapacidad(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      throw error;
    }
  };

  const tableColumns = columns(handleVer, handleEliminar);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!incapacidades || incapacidades.length === 0) {
    return (
      <>
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">
            No tienes registros de incapacidades
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Comienza creando tu primer registro
          </p>
          <Button onClick={() => setOpenCreate(true)}>
            Crear Primer Registro
          </Button>
        </div>

        <IncapacidadCreateDialogEmpleado
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mis Incapacidades</h1>

        <div className="flex items-center gap-2">
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
                document={<IncapacidadesPDF incapacidades={incapacidades} />}
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

          <Button onClick={() => setOpenCreate(true)}>Nuevo Registro</Button>
        </div>
      </div>

      <DataTable columns={tableColumns} data={incapacidades} />

      <IncapacidadCreateDialogEmpleado
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <IncapacidadDetailsDialog
        open={openView}
        onOpenChange={(open) => {
          setOpenView(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
      />

      <IncapacidadDeleteDialogEmpleado
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        isDeleting={isEliminando}
        onConfirm={handleDelete}
      />
    </div>
  );
}
