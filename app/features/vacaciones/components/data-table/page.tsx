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
  ListarVacacionesDTO,
  CrearVacacionDTO,
  ActualizarVacacionDTO,
} from "../../vacaciones.types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useVacaciones } from "../../hooks/useVacaciones";
import { VacacionCreateDialog } from "./dialogs/create-dialog";
import { VacacionDetailsDialog } from "./dialogs/details-dialog";
import { VacacionEditDialog } from "./dialogs/edit-dialog";
import { VacacionDeleteDialog } from "./dialogs/delete-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VacacionesPDF } from "@/app/features/generar-reportes/components/templates/vacaciones-pdf";
import { FileDown, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";

// Feature para Exportar en PDF, Excel o CSV
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

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
  return `vacaciones-${date}.${ext}`;
}

function buildSheetData(incapacidades: ListarVacacionesDTO[]) {
  return incapacidades.map((obj) => ({
    "Fecha Inicio": obj.fechaInicio,
    "Fecha Fin": obj.fechaFin,
    Días: calcularDias(obj.fechaInicio, obj.fechaFin),
    Estado: obj.estadoSolicitud,
    "Fecha Solicitud": obj.fechaSolicitud,
  }));
}

function exportToExcel(incapacidades: ListarVacacionesDTO[]): void {
  const data = buildSheetData(incapacidades);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "vacaciones");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(incapacidades: ListarVacacionesDTO[]): void {
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

export function VacacionesTable() {
  const { vacaciones, isLoading, refetch, crear, actualizar, cancelar } =
    useVacaciones();

  const { empleados } = useEmpleados();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedVacacion, setSelectedVacacion] =
    useState<ListarVacacionesDTO | null>(null);

  const handleCreate = async (data: CrearVacacionDTO) => {
    try {
      await crear.mutateAsync(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear vacación:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: ActualizarVacacionDTO) => {
    if (!selectedVacacion) return;

    try {
      await actualizar.mutateAsync({
        id: selectedVacacion.idVacacion,
        dto: data,
      });
      setOpenUpdate(false);
      setSelectedVacacion(null);
      refetch();
    } catch (error) {
      console.error("Error al actualizar vacación:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cancelar.mutateAsync(id);
      setOpenDelete(false);
      setSelectedVacacion(null);
      refetch();
    } catch (error) {
      console.error("Error al cancelar vacación:", error);
      throw error;
    }
  };

  const handleVer = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenView(true);
  };

  const handleEditar = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenUpdate(true);
  };

  const handleEliminar = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenDelete(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    undefined,
    undefined,
    empleados,
    false,
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

  if (!vacaciones || vacaciones.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay solicitudes de vacaciones
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando una nueva solicitud
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primera Solicitud
        </Button>

        <VacacionCreateDialog
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
            title="Vacaciones"
            entity="Solicitud"
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
              document={<VacacionesPDF vacaciones={vacaciones} />}
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
              onSelect={() => exportToExcel(vacaciones)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>Exportar Excel</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => exportToCSV(vacaciones)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-blue-500" />
              <span>Exportar CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable columns={tableColumns} data={vacaciones} />

      <VacacionCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <VacacionDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        vacacion={selectedVacacion}
      />

      <VacacionEditDialog
        open={openUpdate}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenUpdate(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
        onUpdate={handleUpdate}
      />

      <VacacionDeleteDialog
        open={openDelete}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenDelete(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
        isDeleting={cancelar.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
