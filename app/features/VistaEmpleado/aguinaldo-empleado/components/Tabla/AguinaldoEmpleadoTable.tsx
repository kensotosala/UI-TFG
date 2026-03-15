"use client";

import { useAguinaldoEmpleado } from "@/app/features/aguinaldos/hooks/useAguinaldoEmpleado";
import { DataTable } from "./data-table";
import { useState } from "react";
import { AguinaldoDTO } from "@/app/features/aguinaldos/types";
import { columnsEmpleado } from "./ColumsEmpleadoAguinaldo";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { AguinaldosPDF } from "@/app/features/generar-reportes/components/templates/aguinaldo-pdf";
import { AguinaldoDetailsDialog } from "@/app/features/aguinaldos/components/aguinaldo-table/dialogs/details-dialog";

type TablaProps = {
  empleadoId: number;
};

// Feature para exportar en varios formatos (PDF, xlsx, csv)
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `aguinaldos-${date}.${ext}`;
}

function buildSheetData(aguinaldos: AguinaldoDTO[]) {
  return aguinaldos.map((obj) => ({
    Empleado: obj.nombreEmpleado,
    Días: obj.diasTrabajados,
    "Sal.Promedio": obj.salarioPromedio,
    Monto: obj.montoAguinaldo,
    Fecha: obj.fechaPago,
  }));
}

function exportToExcel(aguinaldos: AguinaldoDTO[]): void {
  const data = buildSheetData(aguinaldos);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "aguinaldos");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(aguinaldos: AguinaldoDTO[]): void {
  const data = buildSheetData(aguinaldos);
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

export function TablaAguinaldosVistaEmpleado({ empleadoId }: TablaProps) {
  const { aguinaldos, isLoading } = useAguinaldoEmpleado(empleadoId ?? 0);

  // Estados para controlar el comportamiento de los dialogs
  const [openDetails, setOpenDetails] = useState(false);

  // Estado para seleccionar una aguinaldo especifico
  const [selectedAguinaldo, setSelectedAguinaldo] =
    useState<AguinaldoDTO | null>(null);

  // Handler para abrir el modal de detalles
  const handleVer = (aguinaldo: AguinaldoDTO) => {
    setSelectedAguinaldo(aguinaldo);
    setOpenDetails(true);
  };

  // Columnas para el DataTable
  const columns = columnsEmpleado(handleVer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!aguinaldos || aguinaldos.length === 0) {
    return (
      <>
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">
            No tienes registros de aguinaldos
          </h3>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mis aguinaldos</h1>

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
                document={<AguinaldosPDF aguinaldos={aguinaldos} />}
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
                onSelect={() => exportToExcel(aguinaldos)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => exportToCSV(aguinaldos)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={aguinaldos} />

      {/* Dialgos */}
      <AguinaldoDetailsDialog
        open={openDetails}
        onOpenChange={(open) => {
          setOpenDetails(open);
          if (!open) setSelectedAguinaldo(null);
        }}
        aguinaldo={selectedAguinaldo}
      />
    </div>
  );
}
