/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { nominaService } from "../../../services/nomina.service";
import { NominaParcialDTO } from "../../../nomina.types";

interface NominaParcialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  yaExisteHoy: boolean;
}

export function NominaParcialDialog({
  open,
  onOpenChange,
  onSuccess,
  yaExisteHoy,
}: NominaParcialDialogProps) {
  const [step, setStep] = useState<"idle" | "preview" | "guardando">("idle");
  const [resultado, setResultado] = useState<NominaParcialDTO | null>(null);

  const handleCalcular = async () => {
    setStep("guardando");
    try {
      const data = await nominaService.calcularNominaParcialHoy();
      setResultado(data);
      setStep("preview");
    } catch (error: any) {
      toast.error("Error al calcular la nómina parcial", {
        description: error.message || "Intenta nuevamente",
      });
      setStep("idle");
    }
  };

  const handleConfirmar = () => {
    toast.success("Nómina parcial guardada", {
      description: `${resultado?.empleados.length} empleados · ${resultado?.diasTranscurridos} días trabajados (${resultado?.porcentajeCompletado}% de la quincena)`,
    });
    onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setStep("idle");
    setResultado(null);
    onOpenChange(false);
  };

  // ── Helpers de formato ─────────────────────────────────────────────
  const formatColones = (n: number) =>
    `₡${n.toLocaleString("es-CR", { maximumFractionDigits: 0 })}`;

  const formatFecha = (iso: string) =>
    format(parseISO(iso), "dd 'de' MMMM", { locale: es });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ── CABECERA ─────────────────────────────────────────────── */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Nómina Parcial al Día de Hoy
          </DialogTitle>
          <DialogDescription>
            {step === "idle" &&
              "Calcula y guarda cuánto ha devengado cada empleado desde el inicio de la quincena actual hasta hoy."}
            {step === "preview" &&
              resultado &&
              `Quincena ${resultado.quincena} · Del ${formatFecha(resultado.inicioQuincena)} al ${formatFecha(resultado.fechaCalculo)} · ${resultado.diasTranscurridos} de ${resultado.diasTotalesQuincena} días (${resultado.porcentajeCompletado}%)`}
            {step === "guardando" && "Calculando, por favor espera..."}
          </DialogDescription>
        </DialogHeader>

        {step === "idle" && (
          <div className="py-6 space-y-4">
            {/* Aviso informativo */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-5 pb-5">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-1 text-sm text-blue-800">
                    <p className="font-semibold text-blue-900">
                      ¿Qué hace esta función?
                    </p>
                    <p>
                      Calcula el salario proporcional de cada empleado activo
                      desde el <strong>primer día de la quincena actual</strong>{" "}
                      hasta <strong>hoy</strong>, aplicando todas las
                      deducciones de CCSS e impuesto de renta de forma
                      proporcional.
                    </p>
                    <p className="mt-2">
                      El resultado se guarda en la base de datos. Si ya existe
                      una nómina parcial del período, se
                      <strong> actualizará</strong> con los nuevos montos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fecha de hoy destacada */}
            <div className="text-center py-4 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">Fecha de cálculo</p>
              <p className="text-2xl font-bold mt-1">
                {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
          </div>
        )}

        {/* ── SPINNER MIENTRAS CARGA ────────────────────────────────── */}
        {step === "guardando" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-muted-foreground text-sm">
              Calculando nóminas proporcionales...
            </p>
          </div>
        )}

        {/* ── PREVIEW DE RESULTADOS ─────────────────────────────────── */}
        {step === "preview" && resultado && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Barra de progreso de la quincena */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Inicio quincena: {formatFecha(resultado.inicioQuincena)}
                </span>
                <span className="font-semibold text-blue-700">
                  {resultado.diasTranscurridos} /{" "}
                  {resultado.diasTotalesQuincena} días
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${resultado.porcentajeCompletado}%` }}
                />
              </div>
            </div>

            {/* Tarjetas de totales */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-blue-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700">Empleados</p>
                      <p className="text-xl font-bold text-blue-900">
                        {resultado.empleados.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700">Total Bruto</p>
                      <p className="text-lg font-bold text-green-900">
                        {formatColones(resultado.totalBruto)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-xs text-red-700">Deducciones</p>
                      <p className="text-lg font-bold text-red-900">
                        {formatColones(resultado.totalDeducciones)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Total neto destacado */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <p className="font-semibold text-purple-900">
                      Total a depositar (neto proporcional)
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatColones(resultado.totalNeto)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lista de empleados */}
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-3 space-y-2">
                {resultado.empleados.map((emp) => (
                  <Card key={emp.empleadoId} className="hover:bg-slate-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-4">
                        {/* Nombre y puesto */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {emp.nombreCompleto}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {emp.departamento} · {emp.puesto}
                          </p>
                        </div>

                        {/* Montos */}
                        <div className="grid grid-cols-3 gap-3 text-right shrink-0">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Proporcional
                            </p>
                            <p className="font-mono text-sm">
                              {formatColones(emp.salarioProporcional)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Deducc.
                            </p>
                            <p className="font-mono text-sm text-red-600">
                              -{formatColones(emp.totalDeducciones)}
                            </p>
                          </div>
                          <div className="bg-purple-50 px-2 py-1 rounded">
                            <p className="text-xs text-purple-700 font-medium">
                              Neto hoy
                            </p>
                            <p className="font-mono text-sm font-bold text-purple-900">
                              {formatColones(emp.totalNeto)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Nota informativa */}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              Los datos ya fueron guardados. Confirma para cerrar este diálogo.
            </p>
          </div>
        )}

        {/* ── BOTONES DE ACCIÓN ─────────────────────────────────────── */}
        <DialogFooter>
          {step === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCalcular}
                disabled={yaExisteHoy}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                {yaExisteHoy ? "Ya calculada hoy" : "Calcular al día de hoy"}
              </Button>
            </>
          )}

          {step === "guardando" && (
            <Button disabled className="bg-blue-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </Button>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
                onClick={handleConfirmar}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Listo, cerrar y actualizar tabla
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
