/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { Calendar } from "lucide-react";
import { useNomina } from "../../hooks/useNomina";
import { NominaDTO } from "../../nomina.types";
import { columns } from "./nomina-columns";
import { GenerarQuincenalDialog } from "./dialogs/nomina-generate-dialog";
import { NominaDetailsDialog } from "./dialogs/nomina-details-dialog";
import { NominaAnularDialog } from "./dialogs/nomina-anular-dialog";
import { nominaService } from "../../services/nomina.service";
import { toast } from "sonner";
import { format, isAfter, startOfDay } from "date-fns";

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

  useEffect(() => {
    const verificarYGenerarNominas = async () => {
      const hoy = startOfDay(new Date());
      const diaActual = hoy.getDate();
      const mesActual = hoy.getMonth() + 1;
      const anioActual = hoy.getFullYear();

      const generacionPendiente = localStorage.getItem(
        `nomina_generada_${anioActual}_${mesActual}`,
      );

      if (generacionPendiente) {
        const { quincena1, quincena2 } = JSON.parse(generacionPendiente);

        if (diaActual === 16 && !quincena1) {
          try {
            await nominaService.generarNominaQuincenal({
              quincena: 1,
              mes: mesActual,
              anio: anioActual,
              fechaPago: format(new Date(), "yyyy-MM-dd"),
              empleadosIds: undefined,
            });

            localStorage.setItem(
              `nomina_generada_${anioActual}_${mesActual}`,
              JSON.stringify({ quincena1: true, quincena2 }),
            );

            toast.success("Nómina generada automáticamente", {
              description: "Primera quincena generada exitosamente",
            });

            refetch();
          } catch (error) {
            console.error("Error generando primera quincena:", error);
          }
        }

        const primerDiaMesSiguiente = new Date(anioActual, mesActual, 1);
        const esPrimerDiaMesSiguiente =
          isAfter(hoy, primerDiaMesSiguiente) ||
          hoy.getTime() === primerDiaMesSiguiente.getTime();

        if (esPrimerDiaMesSiguiente && !quincena2) {
          try {
            await nominaService.generarNominaQuincenal({
              quincena: 2,
              mes: mesActual - 1 || 12,
              anio: mesActual === 1 ? anioActual - 1 : anioActual,
              fechaPago: format(new Date(), "yyyy-MM-dd"),
              empleadosIds: undefined,
            });

            localStorage.setItem(
              `nomina_generada_${anioActual}_${mesActual}`,
              JSON.stringify({ quincena1, quincena2: true }),
            );

            toast.success("Nómina generada automáticamente", {
              description: "Segunda quincena generada exitosamente",
            });

            refetch();
          } catch (error) {
            console.error("Error generando segunda quincena:", error);
          }
        }
      } else {
        localStorage.setItem(
          `nomina_generada_${anioActual}_${mesActual}`,
          JSON.stringify({ quincena1: false, quincena2: false }),
        );
      }
    };

    verificarYGenerarNominas();
  }, [refetch]);

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
                  onClick={() => setOpenGenerate(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4" />
                  Generar Quincena
                </Button>
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
                Las nóminas se generan automáticamente los días 16 y 1 de cada
                mes, o puedes generarlas manualmente
              </p>
              <Button
                onClick={() => setOpenGenerate(true)}
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
    </div>
  );
}
