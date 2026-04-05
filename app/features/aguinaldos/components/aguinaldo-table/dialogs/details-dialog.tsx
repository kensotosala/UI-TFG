// app/features/aguinaldo/components/dialogs/aguinaldo-details-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AguinaldoDTO } from "../../../types";

interface AguinaldoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aguinaldo: AguinaldoDTO | null;
}

export function AguinaldoDetailsDialog({
  open,
  onOpenChange,
  aguinaldo,
}: AguinaldoDetailsDialogProps) {
  if (!aguinaldo) return null;

  const estadoConfig = {
    PENDIENTE: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: Clock,
    },
    PAGADO: {
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle2,
    },
    ANULADO: { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
  };

  const config =
    estadoConfig[
      aguinaldo.estado?.toUpperCase() as keyof typeof estadoConfig
    ] || estadoConfig.PENDIENTE;
  const EstadoIcon = config.icon;

  const fechaCalculo = new Date(aguinaldo.fechaCalculo);
  const anio = fechaCalculo.getFullYear();
  const periodoInicio = `1 de diciembre ${anio - 1}`;
  const periodoFin = `30 de noviembre ${anio}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Aguinaldo {anio}
          </DialogTitle>
          <DialogDescription>
            Información completa del aguinaldo calculado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado */}
          <Card className={config.color}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EstadoIcon className="h-8 w-8" />
                  <div>
                    <p className="font-semibold text-lg">
                      Estado:{" "}
                      {aguinaldo.estado?.toUpperCase() === "PAGADO"
                        ? "CALCULADO"
                        : aguinaldo.estado?.toUpperCase()}
                    </p>
                    {aguinaldo.fechaPago && (
                      <p className="text-sm">
                        Pagado el{" "}
                        {new Date(aguinaldo.fechaPago).toLocaleDateString(
                          "es-CR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Empleado */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Empleado
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-semibold">{aguinaldo.nombreEmpleado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-semibold">{aguinaldo.codigoEmpleado}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Puesto</p>
                      <p className="font-medium">{aguinaldo.puesto}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Departamento
                      </p>
                      <p className="font-medium">{aguinaldo.departamento}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Período y Días Trabajados */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período de Cálculo
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Período
                      </p>
                      <p className="text-lg font-bold text-blue-700">
                        {periodoInicio} - {periodoFin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-900">
                        Días Trabajados
                      </p>
                      <p className="text-3xl font-bold text-blue-700">
                        {aguinaldo.diasTrabajados}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Según Artículo 229 del Código de Trabajo de Costa Rica
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cálculo del Aguinaldo */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cálculo del Aguinaldo
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  {/* <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Salario Promedio Mensual
                    </span>
                    <span className="font-mono text-lg font-semibold">
                      ₡{aguinaldo.salarioPromedio.toLocaleString("es-CR")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Fórmula aplicada</span>
                    <span className="font-mono text-xs">
                      Promedio × ({aguinaldo.diasTrabajados} días / 365)
                    </span>
                  </div>

                  <Separator /> */}

                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Monto Total del Aguinaldo
                        </p>
                        <p className="text-xs text-green-700">
                          {aguinaldo.diasTrabajados === 365
                            ? "Año completo - Aguinaldo total"
                            : "Aguinaldo proporcional"}
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        ₡{aguinaldo.montoAguinaldo.toLocaleString("es-CR")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Fecha de Cálculo</p>
                  <p className="font-medium">
                    {new Date(aguinaldo.fechaCalculo).toLocaleDateString(
                      "es-CR",
                    )}
                  </p>
                </div>
                {aguinaldo.fechaPago && (
                  <div>
                    <p className="text-muted-foreground">Fecha de Pago</p>
                    <p className="font-medium">
                      {new Date(aguinaldo.fechaPago).toLocaleDateString(
                        "es-CR",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
