// app/features/nominas/components/data-table/NominaTable.tsx
"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "./data-table";
import { Calendar, Filter, X } from "lucide-react";
import { useNomina } from "../../hooks/useNomina";
import { NominaDTO } from "../../nomina.types";
import { columns } from "./nomina-columns";
import { GenerarQuincenalDialog } from "./dialogs/nomina-generate-dialog";
import { NominaDetailsDialog } from "./dialogs/nomina-details-dialog";
import { NominaAnularDialog } from "./dialogs/nomina-anular-dialog";

export function NominaAdminTable() {
  // Estados de filtros
  const [quincenaFilter, setQuincenaFilter] = useState<number | undefined>(
    undefined,
  );
  const [mesFilter, setMesFilter] = useState<number | undefined>(undefined);
  const [anioFilter, setAnioFilter] = useState<number | undefined>(undefined);
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS");
  const [searchFilter, setSearchFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { nominas, isLoading, refetch, anularNomina, isDeleting } = useNomina(
    quincenaFilter,
    mesFilter,
    anioFilter,
  );

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);

  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);

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

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
  };

  const handleAnularClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenAnular(true);
  };

  const handleClearFilters = () => {
    setQuincenaFilter(undefined);
    setMesFilter(undefined);
    setAnioFilter(undefined);
    setEstadoFilter("TODOS");
    setSearchFilter("");
  };

  // Filtrar nóminas
  const nominasFiltradas = (nominas || []).filter((nomina) => {
    if (
      estadoFilter !== "TODOS" &&
      nomina.estado?.toUpperCase() !== estadoFilter
    ) {
      return false;
    }

    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      const matchNombre = nomina.nombreEmpleado?.toLowerCase().includes(search);
      const matchCodigo = nomina.codigoEmpleado?.toLowerCase().includes(search);
      return matchNombre || matchCodigo;
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

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>

                <Button
                  onClick={() => setOpenGenerate(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4" />
                  Generar Quincena
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="border rounded-lg p-4 bg-slate-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
                {/* Agrega tus filtros aquí */}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {nominasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p>No hay nóminas</p>
              <Button onClick={() => setOpenGenerate(true)}>
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
    </div>
  );
}
