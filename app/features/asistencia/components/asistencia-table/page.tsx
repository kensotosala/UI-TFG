"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";

import {
  AsistenciaDetallada,
  CrearAsistenciaDTO,
  ActualizarAsistenciaDTO,
  FiltrosAsistencia,
  Asistencia,
} from "../../types";
import { useAsistencias } from "../../hooks/useAsistencia";
import { AsistenciaCreateDialog } from "./dialogs/RegistrarAsistenciaDialog";
import { AsistenciaDetailsDialog } from "./dialogs/detail-dialog";
import { AsistenciaEditDialog } from "./dialogs/edit-dialog";
import { AsistenciaDeleteDialog } from "./dialogs/delete-dialog";
import { AsistenciaJustificarDialog } from "./dialogs/justify-dialog";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import { AsistenciaPDF } from "@/app/features/generar-reportes/components/templates/asistencia-pdf";

// Feature para Exportar en PDF, Excel o CSV
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `asistencia-${date}.${ext}`;
}

function buildSheetData(asistencia: Asistencia[]) {
  return asistencia.map((obj) => ({
    Empleado: obj.empleadoId,
    Fecha: obj.fecha,
    "Hora Entrada": obj.horaEntrada,
    "Hora Salida": obj.horaSalida,
    Estado: obj.estado,
  }));
}

function exportToExcel(asistencia: AsistenciaDetallada[]): void {
  const data = buildSheetData(asistencia);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "asistencia");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(asistencia: AsistenciaDetallada[]): void {
  const data = buildSheetData(asistencia);
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

export function AsistenciasTable() {
  const [filtros] = useState<FiltrosAsistencia>({
    page: 1,
    limit: 20,
  });

  const {
    asistencias,
    isLoading,
    refetch,
    crearAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    justificarAsistencia,
    aprobarJustificacion,
    isUpdating,
    isDeleting,
  } = useAsistencias(filtros);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openJustificar, setOpenJustificar] = useState(false);

  const [selectedAsistencia, setSelectedAsistencia] =
    useState<AsistenciaDetallada | null>(null);

  const handleCreate = async (data: CrearAsistenciaDTO) => {
    try {
      await crearAsistencia(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear asistencia:", error);
    }
  };

  const handleEdit = async (id: string, data: ActualizarAsistenciaDTO) => {
    try {
      await actualizarAsistencia({ id, data });
      setOpenEdit(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al editar asistencia:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarAsistencia(id);
      setOpenDelete(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
    }
  };

  const handleJustificar = async (
    id: string,
    justificacion: {
      tipo: string;
      descripcion: string;
      documentoUrl?: string;
    },
  ) => {
    try {
      await justificarAsistencia({ id, justificacion });
      setOpenJustificar(false);
      setSelectedAsistencia(null);
      refetch();
    } catch (error) {
      console.error("Error al justificar:", error);
    }
  };

  const handleAprobar = async (asistencia: AsistenciaDetallada) => {
    try {
      await aprobarJustificacion(asistencia.id);
      refetch();
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const handleVer = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenView(true);
  };

  const handleEditar = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenEdit(true);
  };

  const handleEliminar = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenDelete(true);
  };

  const handleJustificarClick = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenJustificar(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    handleJustificarClick,
    handleAprobar,
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

  if (asistencias.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay registros de asistencia</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience registrando una nueva asistencia
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Registrar Primera Asistencia
        </Button>

        <AsistenciaCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between gap-5">
        <div className="flex-1">
          <TableHeader
            title="Asistencias"
            entity="Asistencia"
            onAddClick={() => setOpenCreate(true)}
          />
        </div>
        <div className="">
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
                document={<AsistenciaPDF asistencias={asistencias} isAdmin />}
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
                onSelect={() => exportToExcel(asistencias)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => exportToCSV(asistencias)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DataTable columns={tableColumns} data={asistencias} />

      {/* DIÁLOGOS */}
      <AsistenciaCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <AsistenciaDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        asistencia={selectedAsistencia}
      />

      <AsistenciaEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistencia={selectedAsistencia}
        onUpdate={handleEdit}
      />

      <AsistenciaDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistencia={selectedAsistencia}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />

      <AsistenciaJustificarDialog
        open={openJustificar}
        onOpenChange={(open) => {
          setOpenJustificar(open);
          if (!open) setSelectedAsistencia(null);
        }}
        asistenciaId={selectedAsistencia?.id || ""}
        empleadoNombre={
          typeof selectedAsistencia?.empleado === "string"
            ? selectedAsistencia.empleado
            : selectedAsistencia?.empleado?.nombre || ""
        }
        onSave={handleJustificar}
        isLoading={isUpdating}
      />
    </>
  );
}
