/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { NominaDTO } from "../../../nomina.types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  User,
  Briefcase,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

interface NominaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomina: NominaDTO | null;
}

export function NominaDetailsDialog({
  open,
  onOpenChange,
  nomina,
}: NominaDetailsDialogProps) {
  if (!nomina) return null;

  const getEstadoBadge = (estado?: string) => {
    const estadoUpper = estado?.toUpperCase() || "PENDIENTE";

    const variants: Record<string, { variant: any; className: string }> = {
      PENDIENTE: {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      ANULADA: {
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };

    const config = variants[estadoUpper] || variants.PENDIENTE;

    return (
      <Badge variant={config.variant} className={config.className}>
        {estadoUpper}
      </Badge>
    );
  };

  // Determinar quincena del período
  const getPeriodoInfo = () => {
    try {
      const fecha = parseISO(nomina.periodoNomina.toString());
      const dia = fecha.getDate();
      const quincena = dia <= 15 ? "1ª" : "2ª";
      const mes = format(fecha, "MMMM yyyy", { locale: es });
      return { quincena, mes };
    } catch {
      return { quincena: "-", mes: "-" };
    }
  };

  const periodo = getPeriodoInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Detalle de Nómina
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* INFORMACIÓN DEL EMPLEADO */}
          <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-slate-600">Empleado</div>
                  <div className="font-bold text-lg">
                    {nomina.nombreEmpleado}
                  </div>
                  <div className="text-sm text-slate-500">
                    Código: {nomina.codigoEmpleado}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <div className="text-xs text-slate-600">Puesto</div>
                    <div className="font-semibold text-sm">{nomina.puesto}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <div className="text-xs text-slate-600">Departamento</div>
                    <div className="font-semibold text-sm">
                      {nomina.departamento}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PERÍODO Y ESTADO */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <div className="text-sm text-slate-600">Período</div>
                </div>
                <div className="font-bold text-lg">
                  {periodo.quincena} Quincena
                </div>
                <div className="text-sm text-slate-500">{periodo.mes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-slate-600 mb-2">Estado</div>
                <div>{getEstadoBadge(nomina.estado)}</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* INGRESOS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-bold text-slate-700">INGRESOS</h4>
            </div>
            <div className="space-y-2 bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700">Salario Base Quincenal</span>
                <span className="font-mono font-semibold">
                  ₡
                  {nomina.salarioBase.toLocaleString("es-CR", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>

              {nomina.montoHorasExtra && nomina.montoHorasExtra > 0 && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-700">
                    Horas Extra ({nomina.horasExtras?.toFixed(1)} hrs)
                  </span>
                  <span className="font-mono font-semibold text-green-600">
                    +₡
                    {nomina.montoHorasExtra.toLocaleString("es-CR", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}

              {nomina.bonificaciones && nomina.bonificaciones > 0 && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-700">Bonificaciones</span>
                  <span className="font-mono font-semibold text-green-600">
                    +₡
                    {nomina.bonificaciones.toLocaleString("es-CR", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 bg-green-100 px-3 rounded-lg mt-2">
                <span className="font-bold text-green-800">Total Bruto</span>
                <span className="font-mono font-bold text-lg text-green-700">
                  ₡
                  {nomina.totalBruto.toLocaleString("es-CR", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* DEDUCCIONES */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <h4 className="font-bold text-slate-700">DEDUCCIONES</h4>
            </div>
            <div className="space-y-2 bg-slate-50 rounded-lg p-4">
              {nomina.deducciones && nomina.deducciones > 0 && (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <span className="text-slate-700">
                        CCSS + Impuesto Renta
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        CCSS 16.67% + Impuesto según escala progresiva
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-red-600">
                      -₡
                      {nomina.deducciones.toLocaleString("es-CR", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center py-3 bg-red-100 px-3 rounded-lg mt-2">
                <span className="font-bold text-red-800">
                  Total Deducciones
                </span>
                <span className="font-mono font-bold text-lg text-red-700">
                  -₡
                  {(nomina.deducciones || 0).toLocaleString("es-CR", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* TOTAL NETO */}
          <Card className="bg-linear-to-br from-purple-100 to-blue-100 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-purple-700 font-medium">
                    Total Neto a Depositar
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Monto líquido que recibe el empleado
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-3xl text-purple-900">
                    ₡
                    {nomina.totalNeto.toLocaleString("es-CR", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INFORMACIÓN ADICIONAL */}
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            {nomina.fechaCreacion && (
              <div className="flex justify-between">
                <span className="font-medium">Fecha de generación:</span>
                <span>
                  {format(
                    parseISO(nomina.fechaCreacion.toString()),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: es,
                    },
                  )}
                </span>
              </div>
            )}
            {nomina.fechaActualizacion && (
              <div className="flex justify-between">
                <span className="font-medium">Última actualización:</span>
                <span>
                  {format(
                    parseISO(nomina.fechaActualizacion.toString()),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: es,
                    },
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
