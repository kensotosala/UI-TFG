"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAguinaldoEmpleado } from "../../../../aguinaldos/hooks/useAguinaldoEmpleado";
import { AguinaldoDTO } from "../../../../aguinaldos/types";

import { Gift, DollarSign, Calendar, FileText } from "lucide-react";
import { DataTable } from "../../../../aguinaldos/components/aguinaldo-table/data-table";
import { columnsEmpleado } from "./ColumsEmpleadoAguinaldo";
import { AguinaldoEmpleadoDetailsDialog } from "../dialogs/AguinaldoEmpleadoDetailsDialog";

interface AguinaldoEmpleadoTableProps {
  empleadoId: number;
}

export function AguinaldoEmpleadoTable({
  empleadoId,
}: AguinaldoEmpleadoTableProps) {
  const { aguinaldos, isLoading, stats } = useAguinaldoEmpleado(empleadoId);
  const [selected, setSelected] = useState<AguinaldoDTO | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const handleVer = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenDetails(true);
  };

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Aguinaldos
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {stats.totalAguinaldos}
            </div>
            <p className="text-xs text-blue-700 mt-1">Registrados</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-900">
                Pendientes
              </CardTitle>
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">
              {stats.pendientes}
            </div>
            <p className="text-xs text-yellow-700 mt-1">Por pagar</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-linear-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Recibido
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ₡
              {stats.totalRecibido.toLocaleString("es-CR", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-green-700 mt-1">Aguinaldos pagados</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-900">
                Último Aguinaldo
              </CardTitle>
              <Gift className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {stats.ultimoAguinaldo ? (
              <>
                <div className="text-2xl font-bold text-purple-900">
                  ₡
                  {stats.ultimoAguinaldo.montoAguinaldo.toLocaleString(
                    "es-CR",
                    { maximumFractionDigits: 0 },
                  )}
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  {new Date(stats.ultimoAguinaldo.fechaPago!).getFullYear()}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Sin aguinaldos pagados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mis Aguinaldos</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Historial de aguinaldos recibidos
          </p>
        </CardHeader>
        <CardContent>
          {aguinaldos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">
                No hay aguinaldos registrados
              </h3>
              <p className="text-muted-foreground mt-2">
                Tus aguinaldos aparecerán aquí cuando sean generados
              </p>
            </div>
          ) : (
            <DataTable columns={columnsEmpleado(handleVer)} data={aguinaldos} />
          )}
        </CardContent>
      </Card>

      {/* Diálogo */}
      <AguinaldoEmpleadoDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        aguinaldo={selected}
      />
    </div>
  );
}
