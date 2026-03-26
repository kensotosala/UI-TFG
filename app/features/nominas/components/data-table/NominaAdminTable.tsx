/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";
import {
  Calendar,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useNomina } from "../../hooks/useNomina";
import { NominaDTO } from "../../nomina.types";
import { columns } from "./nomina-columns";
import { GenerarQuincenalDialog } from "./dialogs/nomina-generate-dialog";
import { NominaDetailsDialog } from "./dialogs/nomina-details-dialog";
import { NominaAnularDialog } from "./dialogs/nomina-anular-dialog";
import { nominaService } from "../../services/nomina.service";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NominaPDF } from "@/app/features/generar-reportes/components/templates/nomina-pdf";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { NominaParcialDialog } from "./dialogs/nomina-parcial-dialog";

function obtenerQuincenaPendiente(): {
  quincena: 1 | 2;
  mes: number;
  anio: number;
} {
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  if (dia >= 16) {
    return { quincena: 1, mes, anio };
  } else {
    const mesAnterior = mes === 1 ? 12 : mes - 1;
    const anioAnterior = mes === 1 ? anio - 1 : anio;
    return { quincena: 2, mes: mesAnterior, anio: anioAnterior };
  }
}

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null },
);

function getFileName(ext: string) {
  const date = new Date().toISOString().split("T")[0];
  return `nominas-${date}.${ext}`;
}

function buildSheetData(nominas: NominaDTO[]) {
  return nominas.map((n) => ({
    Empleado: n.nombreEmpleado ?? "-",
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

export function NominaAdminTable() {
  const [quincenaFilter, setQuincenaFilter] = useState<number | undefined>(
    undefined,
  );
  const [mesFilter, setMesFilter] = useState<number | undefined>(undefined);
  const [anioFilter, setAnioFilter] = useState<number | undefined>(undefined);
  const [estadoFilter] = useState<string>("TODOS");
  const [searchFilter] = useState("");

  const { nominas, isLoading, refetch, anularNomina, isDeleting } = useNomina(
    quincenaFilter,
    mesFilter,
    anioFilter,
  );

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);
  const [openParcial, setOpenParcial] = useState(false);

  const verificarYGenerarQuincenaPendiente = useCallback(async () => {
    const { quincena, mes, anio } = obtenerQuincenaPendiente();

    const storageKey = `nomina_verificada_${anio}_${mes}_q${quincena}`;
    if (sessionStorage.getItem(storageKey)) return;

    try {
      const nominasExistentes = await nominaService.obtenerNominasQuincena(
        quincena,
        mes,
        anio,
      );

      if (nominasExistentes && nominasExistentes.length > 0) {
        sessionStorage.setItem(storageKey, "ok");
        return;
      }

      await nominaService.generarNominaQuincenal({
        quincena,
        mes,
        anio,
        fechaPago: format(new Date(), "yyyy-MM-dd"),
        empleadosIds: undefined,
      });

      sessionStorage.setItem(storageKey, "ok");

      toast.success("Nómina generada automáticamente", {
        description: `Quincena ${quincena} de ${mes.toString().padStart(2, "0")}/${anio} generada exitosamente.`,
      });

      refetch();
    } catch (error) {
      sessionStorage.setItem(storageKey, "error");
      console.error("Error al verificar/generar nómina pendiente:", error);
    }
  }, [refetch]);

  useEffect(() => {
    verificarYGenerarQuincenaPendiente();
  }, [verificarYGenerarQuincenaPendiente]);

  const handleAnular = async (id: number) => {
    try {
      await anularNomina(id);
      setOpenAnular(false);
      setSelectedNomina(null);
      refetch();
    } catch (error) {
      console.error("Error al anular nómina:", error);
      throw error;
    }
  };

  const formatDateLocal = (date: Date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const yaExisteParcialHoy = (nominas || []).some((n) => {
    if (!n.fechaPago) return false;

    const fechaNomina = formatDateLocal(new Date(n.fechaPago));
    const hoy = formatDateLocal(new Date());

    return fechaNomina === hoy;
  });

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
  };

  const handleAnularClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenAnular(true);
  };

  const nominasFiltradas = (nominas || []).filter((nomina) => {
    if (
      estadoFilter !== "TODOS" &&
      nomina.estado?.toUpperCase() !== estadoFilter
    )
      return false;

    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      return (
        nomina.nombreEmpleado?.toLowerCase().includes(search) ||
        nomina.codigoEmpleado?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const tableColumns = columns(handleVer, handleAnularClick);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Nómina Quincenal
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {nominasFiltradas.length} de {nominas?.length || 0} nóminas
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
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
                        document={<NominaPDF nominas={nominas} isAdmin />}
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
                            <span>
                              {loading ? "Generando..." : "Exportar PDF"}
                            </span>
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => setOpenParcial(true)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4" />
                    Generar Quincena
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {nominasFiltradas.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium">
                No hay nóminas registradas
              </h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Las nóminas se generan automáticamente o puedes generarlas
                manualmente.
              </p>
              <Button
                onClick={() => setOpenParcial(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Generar Quincena
              </Button>
            </div>
          ) : (
            <DataTable columns={tableColumns} data={nominasFiltradas} />
          )}
        </CardContent>
      </Card>

      <GenerarQuincenalDialog
        open={openGenerate}
        onOpenChange={setOpenGenerate}
        onSuccess={refetch}
      />

      <NominaDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        nomina={selectedNomina}
      />

      <NominaAnularDialog
        open={openAnular}
        onOpenChange={setOpenAnular}
        nomina={selectedNomina}
        isDeleting={isDeleting}
        onConfirm={handleAnular}
      />

      <NominaParcialDialog
        open={openParcial}
        onOpenChange={setOpenParcial}
        onSuccess={refetch}
        yaExisteHoy={yaExisteParcialHoy}
      />
    </div>
  );
}
