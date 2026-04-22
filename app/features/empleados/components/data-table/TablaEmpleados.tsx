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

import { Empleado } from "../../types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { EmpleadoDetailsDialog } from "./dialogs/detail-dialog";
import { EmpleadoEditDialog } from "./dialogs/edit-dialog";
import { EmpleadoDeleteDialog } from "./dialogs/delete-dialog";
import { useEmpleados } from "../../hooks/useEmpleado";
import { useEmpleadoMutations } from "../../hooks/useEmpleadosMutation";
import { EmpleadoCreateDialog } from "./dialogs/CrearEmpleadoDialog";
import { EmpleadosPDF } from "@/app/features/generar-reportes/components/templates/empleados-pdf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `empleados-${date}.${ext}`;
}

function buildSheetData(empleados: Empleado[]) {
  return empleados.map((emp) => ({
    Código: emp.codigoEmpleado,
    Nombre:
      `${emp.nombre} ${emp.primerApellido} ${emp.segundoApellido ?? ""}`.trim(),
    Email: emp.email,
    Teléfono: emp.telefono,
    Contrato: emp.tipoContrato,
    Estado: emp.estado ?? "ACTIVO",
    Contratación: emp.fechaContratacion,
  }));
}

function exportToExcel(empleados: Empleado[]): void {
  const data = buildSheetData(empleados);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");
  XLSX.writeFile(workbook, getFileName("xlsx"));
}

function exportToCSV(empleados: Empleado[]): void {
  const data = buildSheetData(empleados);
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

export function EmpleadosTable() {
  const { empleados, isLoading, refetch } = useEmpleados();
  const {
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    isUpdating,
    isDeleting,
  } = useEmpleadoMutations();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (empleadoData: any) => {
    try {
      await createEmpleado({ ...empleadoData, estado: "ACTIVO" });
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear empleado:", error);
    }
  };

  const handleEdit = async (empleado: Empleado) => {
    if (empleado.idEmpleado === undefined) {
      console.error("El empleado no tiene un id válido");
      return;
    }
    await updateEmpleado({
      id: empleado.idEmpleado,
      data: {
        nombre: empleado.nombre,
        primerApellido: empleado.primerApellido,
        segundoApellido: empleado.segundoApellido,
        email: empleado.email,
        telefono: empleado.telefono,
        estado: empleado.estado,
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
      setOpenDelete(false);
      setSelectedEmpleado(null);
      refetch();
    } catch (error) {
      console.log("Error al eliminar empleado:", error);
    }
  };

  const handleVer = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenView(true);
  };

  const handleEditar = (empleado: Empleado) => {
    if (!empleado.idEmpleado) {
      console.error("Empleado seleccionado no tiene un id válido");
      return;
    }
    setSelectedEmpleado(empleado);
    setOpenEdit(true);
  };

  const handleEliminar = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenDelete(true);
  };

  const tableColumns = columns(handleVer, handleEditar, handleEliminar);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay empleados registrados</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo empleado
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Empleado
        </Button>
        <EmpleadoCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Empleados</h1>

        <div className="ml-auto flex items-center gap-2">
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
                document={<EmpleadosPDF empleados={empleados} />}
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
                onSelect={() => exportToExcel(empleados)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>Exportar Excel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => exportToCSV(empleados)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-blue-500" />
                <span>Exportar CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            style={{ backgroundColor: "#052940" }}
            onClick={() => setOpenCreate(true)}
          >
            Agregar Empleado
          </Button>
        </div>
      </div>

      <DataTable columns={tableColumns} data={empleados} />

      <EmpleadoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <EmpleadoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        empleado={selectedEmpleado}
      />

      <EmpleadoEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        onSave={handleEdit}
        isLoading={isUpdating}
      />

      <EmpleadoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
