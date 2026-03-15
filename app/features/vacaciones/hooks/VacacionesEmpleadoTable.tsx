"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../VistaEmpleado/vacaciones-empleado/components/data-table/data-table";

import { VacacionDetailsDialog } from "../../VistaEmpleado/vacaciones-empleado/components/data-table/dialogs/details-dialog";
import { VacacionDeleteDialog } from "../../VistaEmpleado/vacaciones-empleado/components/data-table/dialogs/delete-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  FileText,
  Info,
} from "lucide-react";
import { useVacacionesEmpleado } from "../../VistaEmpleado/vacaciones-empleado/hooks/useVacacionesEmpleado";
import { ListarVacacionesDTO } from "../../VistaEmpleado/vacaciones-empleado/vacaciones.types";
import { columns } from "../../VistaEmpleado/vacaciones-empleado/components/data-table/columns-empleado-vacaciones";
import { VacacionCreateDialogEmpleado } from "../../VistaEmpleado/vacaciones-empleado/components/data-table/dialogs/VacacionCreateDialogEmpleado";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VacacionesPDF } from "@/app/features/generar-reportes/components/templates/vacaciones-pdf";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useNombreEmpleado } from "@/lib/utils";

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

export function VacacionesEmpleadoTable() {
  const { vacaciones, isLoading, saldo, solicitar, cancelar, isCancelando } =
    useVacacionesEmpleado();

  const { user } = useAuthContext();
  const nombreEmpleado = useNombreEmpleado(user?.employeeId ?? 0);

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
          <div className="flex items-center justify-between gap-4">
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
                    <VacacionesPDF
                      vacaciones={vacaciones}
                      empleado={nombreEmpleado}
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
            <Button onClick={() => setOpenCreate(true)}>Nueva Solicitud</Button>
          </div>
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
