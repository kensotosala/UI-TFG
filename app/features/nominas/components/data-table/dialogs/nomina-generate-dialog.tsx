/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/features/nomina/components/dialogs/generar-quincenal-dialog.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { nominaService } from "../../../services/nomina.service";

interface DetalleNominaPreview {
  empleadoId: number;
  nombreCompleto: string;
  departamento: string;
  puesto: string;
  salarioBaseQuincenal: number;
  totalHorasExtra: number;
  bonificaciones: number;
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
}

interface GenerarQuincenalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function GenerarQuincenalDialog({
  open,
  onOpenChange,
  onSuccess,
}: GenerarQuincenalDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"seleccion" | "preview">("seleccion");
  const [quincenaSeleccionada, setQuincenaSeleccionada] = useState<1 | 2>(1);
  const [preview, setPreview] = useState<DetalleNominaPreview[]>([]);

  // Calcular fechas actuales
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; // 1-12
  const anioActual = hoy.getFullYear();

  const fechasQuincena1 = {
    inicio: new Date(anioActual, mesActual - 1, 1),
    fin: new Date(anioActual, mesActual - 1, 15),
  };

  const fechasQuincena2 = {
    inicio: new Date(anioActual, mesActual - 1, 16),
    fin: new Date(
      anioActual,
      mesActual - 1,
      new Date(anioActual, mesActual, 0).getDate(),
    ), // Último día del mes
  };

  const quincena =
    quincenaSeleccionada === 1 ? fechasQuincena1 : fechasQuincena2;

  // Generar vista previa llamando al backend
  const handleGenerarPreview = async () => {
    setIsGenerating(true);
    try {
      // Llamar al endpoint de generación (sin guardar todavía)
      const detalles = await nominaService.generarNominaQuincenal({
        quincena: quincenaSeleccionada,
        mes: mesActual,
        anio: anioActual,
        fechaPago: new Date().toISOString(),
        empleadosIds: undefined, // Todos los empleados activos
      });

      // Mapear respuesta del backend a preview
      const preview = detalles.map((detalle: any) => ({
        empleadoId: detalle.empleadoId,
        nombreCompleto: detalle.nombreCompleto,
        departamento: detalle.departamento || "Sin departamento",
        puesto: detalle.puesto || "Sin puesto",
        salarioBaseQuincenal: detalle.salarioBaseQuincenal,
        totalHorasExtra: detalle.totalHorasExtra,
        bonificaciones: detalle.bonificaciones,
        totalBruto: detalle.totalBruto,
        totalDeducciones: detalle.totalDeducciones,
        totalNeto: detalle.totalNeto,
      }));

      setPreview(preview);
      setStep("preview");
    } catch (error: any) {
      toast.error("Error al generar vista previa", {
        description: error.message || "Intenta nuevamente",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Confirmar y guardar nóminas
  const handleConfirmarGeneracion = async () => {
    setIsGenerating(true);

    try {
      const detalles = await nominaService.generarNominaQuincenal({
        quincena: quincenaSeleccionada,
        mes: mesActual,
        anio: anioActual,
        fechaPago: new Date().toISOString(),
        empleadosIds: undefined,
      });

      toast.success("✅ Nóminas generadas exitosamente", {
        description: `Se generaron ${detalles.length} nóminas para la ${
          quincenaSeleccionada === 1 ? "primera" : "segunda"
        } quincena de ${format(hoy, "MMMM yyyy", { locale: es })}`,
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error("Error al generar nóminas", {
        description: error.message || "Intenta nuevamente",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep("seleccion");
    setPreview([]);
    setQuincenaSeleccionada(1);
    onOpenChange(false);
  };

  // Totales
  const totalEmpleados = preview.length;
  const totalBruto = preview.reduce((sum, emp) => sum + emp.totalBruto, 0);
  const totalDeducciones = preview.reduce(
    (sum, emp) => sum + emp.totalDeducciones,
    0,
  );
  const totalNeto = preview.reduce((sum, emp) => sum + emp.totalNeto, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            {step === "seleccion"
              ? "Generar Nómina Quincenal"
              : "Vista Previa de Depósitos"}
          </DialogTitle>
          <DialogDescription>
            {step === "seleccion"
              ? `Selecciona la quincena a procesar - ${format(hoy, "MMMM yyyy", { locale: es })}`
              : `${totalEmpleados} empleados - Total a depositar: ₡${totalNeto.toLocaleString("es-CR", { maximumFractionDigits: 0 })}`}
          </DialogDescription>
        </DialogHeader>

        {/* PASO 1: SELECCIÓN */}
        {step === "seleccion" && (
          <div className="space-y-6 py-4">
            {/* Información */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold text-blue-900">
                    Período: {format(hoy, "MMMM yyyy", { locale: es })}
                  </p>
                </div>
                <p className="text-sm text-blue-800">
                  Las nóminas se generan para empleados activos según
                  legislación costarricense. Se calcularán automáticamente
                  salarios, horas extras, deducciones CCSS e impuesto sobre la
                  renta.
                </p>
              </CardContent>
            </Card>

            {/* Selección de quincena */}
            <div className="grid grid-cols-2 gap-4">
              {/* Primera Quincena */}
              <Card
                className={`cursor-pointer transition-all ${
                  quincenaSeleccionada === 1
                    ? "border-2 border-blue-500 bg-blue-50"
                    : "border hover:border-blue-300"
                }`}
                onClick={() => setQuincenaSeleccionada(1)}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Badge
                      variant={
                        quincenaSeleccionada === 1 ? "default" : "outline"
                      }
                      className="text-lg px-4 py-2"
                    >
                      Primera Quincena
                    </Badge>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-bold text-lg">
                        {format(fechasQuincena1.inicio, "dd", { locale: es })} -{" "}
                        {format(fechasQuincena1.fin, "dd MMM yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      15 días laborales
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Segunda Quincena */}
              <Card
                className={`cursor-pointer transition-all ${
                  quincenaSeleccionada === 2
                    ? "border-2 border-blue-500 bg-blue-50"
                    : "border hover:border-blue-300"
                }`}
                onClick={() => setQuincenaSeleccionada(2)}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Badge
                      variant={
                        quincenaSeleccionada === 2 ? "default" : "outline"
                      }
                      className="text-lg px-4 py-2"
                    >
                      Segunda Quincena
                    </Badge>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-bold text-lg">
                        {format(fechasQuincena2.inicio, "dd", { locale: es })} -{" "}
                        {format(fechasQuincena2.fin, "dd MMM yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {differenceInDays(
                        fechasQuincena2.fin,
                        fechasQuincena2.inicio,
                      ) + 1}{" "}
                      días laborales
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PASO 2: PREVIEW */}
        {step === "preview" && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Cards de resumen */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="bg-blue-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700">Empleados</p>
                      <p className="text-xl font-bold text-blue-900">
                        {totalEmpleados}
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
                        ₡
                        {totalBruto.toLocaleString("es-CR", {
                          maximumFractionDigits: 0,
                        })}
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
                        ₡
                        {totalDeducciones.toLocaleString("es-CR", {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-purple-700">Total Neto</p>
                      <p className="text-lg font-bold text-purple-900">
                        ₡
                        {totalNeto.toLocaleString("es-CR", {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de empleados */}
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-4 space-y-2">
                {preview.map((emp) => (
                  <Card key={emp.empleadoId} className="hover:bg-slate-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {emp.nombreCompleto}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {emp.departamento} • {emp.puesto}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-3 text-right">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Salario
                            </p>
                            <p className="font-mono text-sm">
                              ₡
                              {emp.salarioBaseQuincenal.toLocaleString(
                                "es-CR",
                                {
                                  maximumFractionDigits: 0,
                                },
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Bruto
                            </p>
                            <p className="font-mono text-sm text-green-700">
                              ₡
                              {emp.totalBruto.toLocaleString("es-CR", {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Deducc.
                            </p>
                            <p className="font-mono text-sm text-red-700">
                              -₡
                              {emp.totalDeducciones.toLocaleString("es-CR", {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>

                          <div className="bg-purple-50 px-2 py-1 rounded">
                            <p className="text-xs text-purple-700 font-medium">
                              Depositar
                            </p>
                            <p className="font-mono text-sm font-bold text-purple-900">
                              ₡
                              {emp.totalNeto.toLocaleString("es-CR", {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === "seleccion" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleGenerarPreview}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Ver Vista Previa
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep("seleccion")}
                disabled={isGenerating}
              >
                ← Volver
              </Button>
              <Button
                onClick={handleConfirmarGeneracion}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Generar {totalEmpleados} Nóminas
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
