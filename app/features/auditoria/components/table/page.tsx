"use client";

import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

import {
  ChevronDown,
  ClipboardList,
  FileDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useAuditoriaCambios } from "../../hooks/useAuditoriaCambios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AuditoriaCambios } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuditoriaPDF } from "@/app/features/generar-reportes/components/templates/auditoria-pdf";

// Feature para Exportar en PDF, Excel o CSV
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `auditoria-${date}.${ext}`;
}

function buildSheetData(auditoria: AuditoriaCambios[]) {
  return auditoria.map((obj) => ({
    ID: obj.idAuditoria,
    Usuario: obj.usuarioId,
    Fecha: obj.fechaCreacion,
    Tabla: obj.tablaAfectada,
    Descripcion: obj.descripcion,
  }));
}

function exportToExcel(auditoria: AuditoriaCambios[]): void {
  const data = buildSheetData(auditoria);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "auditoria");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(auditoria: AuditoriaCambios[]): void {
  const data = buildSheetData(auditoria);
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

export default function AuditoriaPage() {
  const { data, isLoading, error } = useAuditoriaCambios();

  if (isLoading) {
    return <div className="container mx-auto py-10">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-red-500">
        Error al cargar los datos
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto py-10">
        No se encuentra el contenido
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold tracking-tight">
              Auditoria Logs
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los logs registrados por el sistema
            </p>
          </div>
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
                document={<AuditoriaPDF logs={data} />}
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
                onSelect={() => exportToExcel(data)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => exportToCSV(data)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
