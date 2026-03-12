// permisos-empleado-table.tsx
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
import { DataTable } from "./data-table";
import { usePermisosEmpleado } from "../hooks/usePermisoEmpleado";
import { Permiso, CrearPermisoDTO } from "@/app/features/permisos/types";
import { columns } from "./columns";
import { PermisoCreateDialog } from "./dialogs/SolicitarPermisoDialog";
import { PermisoDetailsDialog } from "./dialogs/VerPermisoDialog";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PermisosPDF } from "@/app/features/generar-reportes/components/templates/permisos-pdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string) {
  const date = new Date().toISOString().split("T")[0];
  return `permisos-${date}.${ext}`;
}

function buildSheetData(permisos: Permiso[]) {
  return permisos.map((p) => ({
    "Fecha Permiso": p.fechaPermiso ?? "-",
    "Fecha Solicitud": p.fechaSolicitud ?? "-",
    Motivo: p.motivo ?? "-",
    "Goce Salario": p.conGoceSalario ? "Sí" : "No",
    Estado: p.estadoSolicitud ?? "-",
    "Fecha Aprobación": p.fechaAprobacion ?? "-",
  }));
}

function exportToExcel(permisos: Permiso[]) {
  const data = buildSheetData(permisos);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Permisos");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(permisos: Permiso[]) {
  const data = buildSheetData(permisos);
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

export function PermisosEmpleadoTable() {
  const { user } = useAuthContext();
  const { permisos, isLoading, solicitar, isSolicitando } =
    usePermisosEmpleado();

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);

  const handleCreate = async (data: {
    fechaPermiso: string;
    motivo: string;
    conGoceSalario: boolean;
  }) => {
    if (!user?.employeeId) return;
    const payload: CrearPermisoDTO = {
      empleadoId: user.employeeId,
      fechaPermiso: data.fechaPermiso,
      motivo: data.motivo,
      conGoceSalario: data.conGoceSalario,
    };
    solicitar(payload, { onSuccess: () => setOpenCreate(false) });
  };

  const handleVer = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenView(true);
  };

  const tableColumns = columns(handleVer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!permisos || permisos.length === 0) {
    return (
      <>
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">
            No hay solicitudes de permisos
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Comience creando una nueva solicitud
          </p>
          <Button onClick={() => setOpenCreate(true)}>
            Crear Primera Solicitud
          </Button>
        </div>

        <PermisoCreateDialog
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
        <h1 className="text-3xl font-semibold">Mis Permisos</h1>

        <div className="flex items-center gap-2">
          {/* Dropdown Exportar */}
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
                document={<PermisosPDF permisos={permisos} />}
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
                onSelect={() => exportToExcel(permisos)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              {/* CSV */}
              <DropdownMenuItem
                onSelect={() => exportToCSV(permisos)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nueva Solicitud */}
          <Button onClick={() => setOpenCreate(true)} disabled={isSolicitando}>
            Nueva Solicitud
          </Button>
        </div>
      </div>

      <DataTable columns={tableColumns} data={permisos} />

      <PermisoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <PermisoDetailsDialog
        open={openView}
        onOpenChange={(open) => {
          setOpenView(open);
          if (!open) setSelectedPermiso(null);
        }}
        permiso={selectedPermiso}
      />
    </div>
  );
}
