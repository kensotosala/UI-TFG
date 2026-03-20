"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

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

import { VerDetallesLiquidacion } from "../dialogs/VerDetallesLiquidacionDialog";
import { AnularLiquidacionDialog } from "../dialogs/AnularLiquidacionDialog";
import EditarLiquidacionDialog from "../dialogs/EditarLiquidacionDialog";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  ChevronDown,
  ClipboardList,
  FileDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiquidacionesPDF } from "@/app/features/generar-reportes/components/templates/liquidaciones-pdf";
import { useNombreEmpleado } from "@/lib/utils";

// Feature para Exportar en PDF, Excel o CSV
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `liquidaciones-${date}.${ext}`;
}

function buildSheetData(liquidaciones: LiquidacionDTO[]) {
  return liquidaciones.map((obj) => ({
    ID: obj.idLiquidacion,
    "Monto Preaviso": obj.montoPreaviso,
    "Monto Vacaciones": obj.montoVacaciones,
    "Monto Aguinaldo": obj.montoAguinaldo,
    "Monto Cesantía": obj.montoCesantia,
    Total: obj.montoTotal,
    Fecha: obj.fechaLiquidacion,
  }));
}

function exportToExcel(liquidaciones: LiquidacionDTO[]): void {
  const data = buildSheetData(liquidaciones);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "liquidaciones");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(liquidaciones: LiquidacionDTO[]): void {
  const data = buildSheetData(liquidaciones);
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

  const { user, checkRole } = useAuthContext();
  const nombreEmpleado = useNombreEmpleado(user?.employeeId ?? 0);

  console.log("Usuario cargado:", user);
  console.log("checkRole ADMIN:", checkRole("ADMIN"));

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

          {checkRole("ADMIN") && (
            <Button onClick={() => setOpenCreate(true)}>
              Crear Primer Registro
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Mis Liquidaciones
                </h1>
                <p className="text-muted-foreground text-sm">
                  Consulta y gestiona tus liquidaciones.
                </p>
              </div>
            </div>

            {checkRole("ADMIN") && (
              <div className="flex-1 flex justify-end">
                <Button
                  style={{ backgroundColor: "#052940" }}
                  onClick={() => setOpenCreate(true)}
                >
                  Agregar Liquidación
                </Button>
              </div>
            )}

            <div className="flex items-center">
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
                      <LiquidacionesPDF
                        liquidaciones={liquidaciones}
                        nombreEmpleado={nombreEmpleado}
                        isAdmin={checkRole("ADMIN")}
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
                    onSelect={() => exportToExcel(liquidaciones)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span>Exportar Excel</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => exportToCSV(liquidaciones)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileDown className="h-4 w-4 text-blue-500" />
                    <span>Exportar CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="container mx-auto py-10">
            <DataTable
              columns={columns(handleVer, handleEditar, handleEliminar)}
              data={liquidaciones}
            />
          </div>
        </>
      )}

      {checkRole("ADMIN") && (
        <NuevaLiquidacionDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      )}

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
