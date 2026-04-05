"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Calculator,
  Gift,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useAguinaldo } from "../../hooks/useAguinaldo";
import { AguinaldoDTO } from "../../types";
import { DataTable } from "./data-table";
import { CalcularAguinaldoDialog } from "./dialogs/calcular-dialog";
import { AguinaldoDetailsDialog } from "./dialogs/details-dialog";
import { AguinaldoPagarDialog } from "./dialogs/pagar-dialog";
import { AguinaldoAnularDialog } from "./dialogs/anular-dialog";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AguinaldosPDF } from "@/app/features/generar-reportes/components/templates/aguinaldo-pdf";

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

interface AguinaldoTableProps {
  anio?: number;
}

export function AguinaldoTable({ anio }: AguinaldoTableProps) {
  const currentYear = new Date().getFullYear();
  const year = anio || currentYear;

  const { aguinaldos, isLoading, pagarAguinaldo, anularAguinaldo, refetch } =
    useAguinaldo();

  const [openCalc, setOpenCalc] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPagar, setOpenPagar] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);
  const [selected, setSelected] = useState<AguinaldoDTO | null>(null);

  const handleVer = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenDetails(true);
  };

  const handlePagarClick = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenPagar(true);
  };

  const handleAnularClick = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenAnular(true);
  };

  const handlePagar = async (id: number, fechaPago: string) => {
    await pagarAguinaldo(id, fechaPago);
    setOpenPagar(false);
    setSelected(null);
  };

  const handleAnular = async (id: number) => {
    await anularAguinaldo(id);
    setOpenAnular(false);
    setSelected(null);
  };

  const tableColumns = columns(handleVer, handlePagarClick, handleAnularClick);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabla Principal */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Aguinaldos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {aguinaldos.length} aguinaldo
                {aguinaldos.length !== 1 ? "s" : ""} registrado
                {aguinaldos.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
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

                  {/* Excel */}
                  <DropdownMenuItem
                    onSelect={() => exportToExcel(aguinaldos)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span>Exportar Excel</span>
                  </DropdownMenuItem>

                  {/* CSV */}
                  <DropdownMenuItem
                    onSelect={() => exportToCSV(aguinaldos)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileDown className="h-4 w-4 text-blue-500" />
                    <span>Exportar CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => setOpenCalc(true)}
                variant="outline"
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calcular Aguinaldos
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {aguinaldos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">
                No hay aguinaldos registrados para {year}
              </h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Calcula y genera los aguinaldos para todos los empleados
              </p>
              <Button
                onClick={() => setOpenCalc(true)}
                className="bg-linear-to-r from-blue-600 to-indigo-600"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calcular Aguinaldos {year}
              </Button>
            </div>
          ) : (
            <DataTable columns={tableColumns} data={aguinaldos} />
          )}
        </CardContent>
      </Card>

      {/* DIÁLOGOS */}
      <CalcularAguinaldoDialog
        open={openCalc}
        onOpenChange={setOpenCalc}
        anio={year}
        onSuccess={refetch}
      />

      <AguinaldoDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        aguinaldo={selected}
      />

      <AguinaldoPagarDialog
        open={openPagar}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenPagar(open);
          if (!open) setSelected(null);
        }}
        aguinaldo={selected}
        onConfirm={handlePagar}
      />

      <AguinaldoAnularDialog
        open={openAnular}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenAnular(open);
          if (!open) setSelected(null);
        }}
        aguinaldo={selected}
        onConfirm={handleAnular}
      />
    </div>
  );
}
