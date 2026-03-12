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
import { DataTable } from "@/app/features/asistencia/components/asistencia-table/data-table";
import { AsistenciaDetailsDialog } from "@/app/features/asistencia/components/asistencia-table/dialogs/detail-dialog";
import { AsistenciaDetallada } from "@/app/features/asistencia/types";
import { columnsEmpleado } from "./columns-empleado";
import { useAsistenciasEmpleado } from "../../hooks/use-asistencia-empleado";
import { AsistenciaPDF } from "@/app/features/generar-reportes/components/templates/asistencia-pdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string) {
  const date = new Date().toISOString().split("T")[0];
  return `asistencias-${date}.${ext}`;
}

function buildSheetData(asistencias: AsistenciaDetallada[]) {
  return asistencias.map((a) => ({
    Fecha: a.fecha ?? "-",
    Entrada: a.horaEntrada ?? "-",
    Salida: a.horaSalida ?? "-",
    Estado: a.estado ?? "-",
    Observación: a.observaciones ?? "-",
  }));
}

function exportToExcel(asistencias: AsistenciaDetallada[]) {
  const data = buildSheetData(asistencias);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(asistencias: AsistenciaDetallada[]) {
  const data = buildSheetData(asistencias);
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

export function AsistenciasEmpleadoTable() {
  const { asistencias, isLoading } = useAsistenciasEmpleado();
  const [openView, setOpenView] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] =
    useState<AsistenciaDetallada | null>(null);

  const handleVer = (asistencia: AsistenciaDetallada) => {
    setSelectedAsistencia(asistencia);
    setOpenView(true);
  };

  const tableColumns = columnsEmpleado(handleVer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No tienes asistencias registradas
        </h3>
        <p className="text-muted-foreground mt-2">
          Tus registros de asistencia aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mis Asistencias</h1>

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

            {/* PDF */}
            <PDFDownloadLink
              document={<AsistenciaPDF asistencias={asistencias} />}
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

            {/* Excel */}
            <DropdownMenuItem
              onSelect={() => exportToExcel(asistencias)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>Exportar Excel</span>
            </DropdownMenuItem>

            {/* CSV */}
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

      <DataTable columns={tableColumns} data={asistencias} />

      <AsistenciaDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        asistencia={selectedAsistencia}
      />
    </div>
  );
}
