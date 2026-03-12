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
import { useNominaEmpleado } from "../../hooks/useNominaEmpleado";
import { NominaDTO } from "../../nomina.types";
import { columnsEmpleado } from "./columns-empleado-nomina";
import { DataTable } from "./data-table";
import { NominaEmpleadoDetailsDialog } from "./dialogs/empleado-details-dialog";
import { NominaPDF } from "@/app/features/generar-reportes/components/templates/nomina-pdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

interface NominaEmpleadoTableProps {
  empleadoId: number;
}

function getFileName(ext: string) {
  const date = new Date().toISOString().split("T")[0];
  return `nominas-${date}.${ext}`;
}

function buildSheetData(nominas: NominaDTO[]) {
  return nominas.map((n) => ({
    Período: n.periodoNomina ?? "-",
    "Fecha Pago": n.fechaPago ?? "-",
    "Salario Bruto": n.totalBruto ?? 0,
    Deducciones: n.deducciones ?? 0,
    "Total Neto": n.totalNeto ?? 0,
    Estado: n.estado ?? "-",
  }));
}

function exportToExcel(nominas: NominaDTO[]) {
  const data = buildSheetData(nominas);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nóminas");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(nominas: NominaDTO[]) {
  const data = buildSheetData(nominas);
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

export function NominaEmpleadoTable({ empleadoId }: NominaEmpleadoTableProps) {
  const { nominas, isLoading } = useNominaEmpleado(empleadoId);
  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
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

  if (nominas.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No tienes nóminas registradas</h3>
        <p className="text-muted-foreground mt-2">
          Tus registros de nómina aparecerán aquí cuando sean generados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-12 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mis Nóminas</h1>

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
              document={<NominaPDF nominas={nominas} />}
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
              onSelect={() => exportToExcel(nominas)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>Exportar Excel</span>
            </DropdownMenuItem>

            {/* CSV */}
            <DropdownMenuItem
              onSelect={() => exportToCSV(nominas)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-blue-500" />
              <span>Exportar CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable columns={tableColumns} data={nominas} />

      <NominaEmpleadoDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        nomina={selectedNomina}
      />
    </div>
  );
}
