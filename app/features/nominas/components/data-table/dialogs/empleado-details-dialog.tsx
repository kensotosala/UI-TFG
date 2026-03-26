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
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { NominaDTO } from "../../../nomina.types";

interface NominaEmpleadoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomina: NominaDTO | null;
}

export function NominaEmpleadoDetailsDialog({
  open,
  onOpenChange,
  nomina,
}: NominaEmpleadoDetailsDialogProps) {
  if (!nomina) return null;

  const getEstadoBadge = (estado?: string) => {
    const estadoUpper = estado?.toUpperCase() || "PENDIENTE";
    const config: Record<string, { variant: any; className: string }> = {
      PENDIENTE: {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      PAGADA: {
        variant: "default",
        className: "bg-green-100 text-green-800 border-green-300",
      },
      ANULADA: {
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };
    const selected = config[estadoUpper] || config.PENDIENTE;
    return (
      <Badge variant={selected.variant} className={selected.className}>
        {estadoUpper}
      </Badge>
    );
  };

  const fecha = new Date(nomina.periodoNomina);
  const dia = fecha.getDate();
  const quincena = dia <= 15 ? "1ª" : "2ª";

  // Calcular desglose de deducciones
  const ccss = nomina.totalBruto * 0.1667;
  const impuesto = (nomina.deducciones || 0) - ccss;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-162.5 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalle de Nómina</DialogTitle>
            {getEstadoBadge(nomina.estado)}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Período de Pago */}
          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-600">Período de Pago</div>
              <div className="font-semibold text-lg text-slate-900">
                {quincena} Quincena -{" "}
                {fecha.toLocaleDateString("es-CR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {nomina.fechaPago && (
                <div className="text-sm text-slate-500 mt-1">
                  📅 Fecha de pago:{" "}
                  {new Date(nomina.fechaPago).toLocaleDateString("es-CR")}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* INGRESOS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-800">INGRESOS</h4>
            </div>

            <div className="space-y-2 bg-linear-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-center py-2 border-b border-green-100">
                <div>
                  <span className="text-slate-700">Salario Base Quincenal</span>
                  <p className="text-xs text-slate-500">Salario fijo</p>
                </div>
                <span className="font-mono font-semibold text-slate-900">
                  ₡{nomina.salarioBase.toLocaleString("es-CR")}
                </span>
              </div>

              {nomina.montoHorasExtra && nomina.montoHorasExtra > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <div>
                    <span className="text-slate-700">Horas Extra</span>
                    <p className="text-xs text-slate-500">
                      {nomina.horasExtras?.toFixed(2)} horas trabajadas
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-green-600">
                    +₡{nomina.montoHorasExtra.toLocaleString("es-CR")}
                  </span>
                </div>
              )}

              {nomina.bonificaciones && nomina.bonificaciones > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <div>
                    <span className="text-slate-700">Bonificaciones</span>
                    <p className="text-xs text-slate-500">Bonos adicionales</p>
                  </div>
                  <span className="font-mono font-semibold text-green-600">
                    +₡{nomina.bonificaciones.toLocaleString("es-CR")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 pb-2">
                <span className="font-semibold text-slate-800">
                  Total Bruto
                </span>
                <span className="font-mono font-bold text-lg text-slate-900">
                  ₡{nomina.totalBruto.toLocaleString("es-CR")}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* DEDUCCIONES */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <h4 className="font-semibold text-slate-800">DEDUCCIONES</h4>
            </div>

            <div className="space-y-2 bg-linear-to-br from-red-50 to-white p-4 rounded-lg border border-red-100">
              <div className="flex justify-between items-center py-2 border-b border-red-100">
                <div>
                  <span className="text-slate-700">CCSS (Seguro Social)</span>
                  <p className="text-xs text-slate-500">
                    16.67% del salario bruto
                  </p>
                </div>
                <span className="font-mono font-semibold text-red-600">
                  -₡{ccss.toLocaleString("es-CR", { maximumFractionDigits: 2 })}
                </span>
              </div>

              {impuesto > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <div>
                    <span className="text-slate-700">Impuesto sobre Renta</span>
                    <p className="text-xs text-slate-500">
                      Según escala progresiva
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-red-600">
                    -₡
                    {impuesto.toLocaleString("es-CR", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 pb-2">
                <span className="font-semibold text-slate-800">
                  Total Deducciones
                </span>
                <span className="font-mono font-bold text-lg text-red-700">
                  -₡{(nomina.deducciones || 0).toLocaleString("es-CR")}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* TOTAL NETO */}
          <div className="p-5 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white/80 mb-1 font-medium">
                  💰 Total a Recibir
                </div>
                <div className="text-4xl font-bold text-white">
                  ₡{nomina.totalNeto.toLocaleString("es-CR")}
                </div>
              </div>
              <div className="p-4 bg-white/20 rounded-full">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h5 className="font-semibold text-sm text-blue-900 mb-2">
              ℹ️ Información Importante
            </h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                • Los montos mostrados corresponden al período quincenal
                indicado
              </li>
              <li>• Las deducciones de CCSS son obligatorias por ley</li>
              <li>
                • El impuesto sobre la renta se aplica según escala progresiva
              </li>
              <li>• Para consultas, contacte a Recursos Humanos</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
