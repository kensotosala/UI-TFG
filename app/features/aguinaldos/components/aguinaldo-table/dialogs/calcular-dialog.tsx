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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Calculator,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { AguinaldoDTO } from "../../../types";
import { useAguinaldo } from "../../../hooks/useAguinaldo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalcularAguinaldoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anio: number;
  onSuccess: () => void;
}

type ModoCalculo = "anual" | "hasta-hoy";

export function CalcularAguinaldoDialog({
  open,
  onOpenChange,
  anio,
  onSuccess,
}: CalcularAguinaldoDialogProps) {
  const currentYear = new Date().getFullYear();
  const today = new Date();

  const [selectedAnio, setSelectedAnio] = useState(anio.toString());
  const [modoCalculo, setModoCalculo] = useState<ModoCalculo>("hasta-hoy");
  const [step, setStep] = useState<"config" | "resultados">("config");

  const [resultados, setResultados] = useState<AguinaldoDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { calcularAguinaldosMasivo, isCalculating } = useAguinaldo(
    parseInt(selectedAnio),
  );

  const handleCalcular = async () => {
    try {
      const response = await calcularAguinaldosMasivo({
        anio: parseInt(selectedAnio),
      });

      console.log(response);

      setResultados([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmar = () => {
    onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setStep("config");
    setResultados([]);
    setSelectedIds([]);
    setModoCalculo("anual");
    onOpenChange(false);
  };

  const toggleEmpleado = (empleadoId: number) => {
    setSelectedIds((prev) =>
      prev.includes(empleadoId)
        ? prev.filter((id) => id !== empleadoId)
        : [...prev, empleadoId],
    );
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === resultados.length
        ? []
        : resultados.map((r) => r.empleadoId),
    );
  };

  const totalCalculado = resultados.reduce(
    (sum, r) => sum + r.montoAguinaldo,
    0,
  );

  const fechaCorteLabel = today.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const modoLabel =
    modoCalculo === "hasta-hoy"
      ? `hasta el ${fechaCorteLabel}`
      : `año completo ${selectedAnio}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl w-full flex flex-col"
        style={{ height: "85vh", maxHeight: "85vh" }}
      >
        {/* HEADER */}
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {step === "config"
              ? "Calcular Aguinaldos"
              : "Aguinaldos Registrados"}
          </DialogTitle>
          <DialogDescription>
            {step === "config"
              ? "Selecciona el año y el modo de cálculo según legislación CR"
              : `${resultados.length} aguinaldos calculados y registrados (${modoLabel})`}
          </DialogDescription>
        </DialogHeader>

        {/* CUERPO SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2">
          {/* ── PASO 1: CONFIGURACIÓN ── */}
          {step === "config" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Año del Aguinaldo</Label>
                <Select value={selectedAnio} onValueChange={setSelectedAnio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value={(currentYear - 1).toString()}>
                      {currentYear - 1}
                    </SelectItem> */}
                    <SelectItem value={currentYear.toString()}>
                      {currentYear}
                    </SelectItem>
                    {/* <SelectItem value={(currentYear + 1).toString()}>
                      {currentYear + 1}
                    </SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modo de cálculo</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={today < new Date(`${selectedAnio}-11-30`)}
                    onClick={() => setModoCalculo("anual")}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      modoCalculo === "anual"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CalendarRange
                        className={`h-5 w-5 mt-0.5 shrink-0 ${
                          modoCalculo === "anual"
                            ? "text-blue-600"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            modoCalculo === "anual"
                              ? "text-blue-900"
                              : "text-slate-700"
                          }`}
                        >
                          Año completo
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          1 dic {Number(selectedAnio) - 1} → 30 nov{" "}
                          {selectedAnio}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModoCalculo("hasta-hoy")}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      modoCalculo === "hasta-hoy"
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CalendarDays
                        className={`h-5 w-5 mt-0.5 shrink-0 ${
                          modoCalculo === "hasta-hoy"
                            ? "text-orange-600"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            modoCalculo === "hasta-hoy"
                              ? "text-orange-900"
                              : "text-slate-700"
                          }`}
                        >
                          Hasta hoy
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Fecha de corte: {fechaCorteLabel}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {modoCalculo === "anual" ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-blue-900">
                          Legislación de Costa Rica — Artículo 229
                        </p>
                        <ul className="space-y-1 text-blue-800">
                          <li>
                            • Período: 1 dic {Number(selectedAnio) - 1} → 30 nov{" "}
                            {selectedAnio}
                          </li>
                          <li>
                            • Cálculo: Promedio de salarios brutos del período
                          </li>
                          <li>
                            • Aguinaldo = Salario promedio × (Días trabajados /
                            365)
                          </li>
                          <li>
                            • Mínimo: 1 mes de salario (si trabajó el año
                            completo)
                          </li>
                          <li>• Debe pagarse antes del 20 de diciembre</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-orange-900">
                          Cálculo proporcional hasta hoy
                        </p>
                        <ul className="space-y-1 text-orange-800">
                          <li>
                            • Fecha de corte: <strong>{fechaCorteLabel}</strong>
                          </li>
                          <li>
                            • Los aguinaldos se registran automáticamente al
                            calcular
                          </li>
                          <li>
                            • Útil para anticipos, proyecciones o bajas antes de
                            diciembre
                          </li>
                          <li>
                            • El monto será proporcional a los días
                            transcurridos
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ── PASO 2: RESULTADOS (solo informativo — ya están en DB) ── */}
          {step === "resultados" && (
            <div className="flex flex-col gap-4 h-full">
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-900">
                      {resultados.length}
                    </div>
                    <p className="text-xs text-blue-700">Registrados</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-900">
                      {
                        resultados.filter((r) => r.estado === "PENDIENTE")
                          .length
                      }
                    </div>
                    <p className="text-xs text-green-700">Pendientes de pago</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50">
                  <CardContent className="pt-6">
                    <div className="text-xl font-bold text-purple-900">
                      ₡
                      {totalCalculado.toLocaleString("es-CR", {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <p className="text-xs text-purple-700">Total calculado</p>
                  </CardContent>
                </Card>
              </div>

              {/* Badge de modo */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    modoCalculo === "hasta-hoy"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {modoCalculo === "hasta-hoy" ? (
                    <CalendarDays className="h-3.5 w-3.5" />
                  ) : (
                    <CalendarRange className="h-3.5 w-3.5" />
                  )}
                  {modoCalculo === "hasta-hoy"
                    ? `Cálculo hasta hoy — ${fechaCorteLabel}`
                    : `Año completo ${selectedAnio}`}
                </span>
                {/* Indicador de que ya están guardados */}
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Guardados en base de datos
                </span>
              </div>

              {/* Seleccionar todos (solo visual, no afecta registro) */}
              <div className="flex items-center space-x-2 px-2 shrink-0">
                <Checkbox
                  id="select-all"
                  checked={selectedIds.length === resultados.length}
                  onCheckedChange={toggleAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Seleccionar todos
                </label>
              </div>

              {/* Lista de resultados */}
              <ScrollArea className="flex-1 border rounded-lg min-h-0">
                <div className="p-4 space-y-2">
                  {resultados.map((resultado) => (
                    <Card
                      key={resultado.empleadoId}
                      className={`cursor-pointer transition-colors ${
                        selectedIds.includes(resultado.empleadoId)
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() => toggleEmpleado(resultado.empleadoId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedIds.includes(resultado.empleadoId)}
                            onCheckedChange={() =>
                              toggleEmpleado(resultado.empleadoId)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                              <p className="font-semibold text-sm">
                                {resultado.nombreEmpleado}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {resultado.diasTrabajados} días trabajados
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Salario Promedio
                              </p>
                              <p className="font-mono text-sm">
                                ₡
                                {resultado.salarioPromedio.toLocaleString(
                                  "es-CR",
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Monto Aguinaldo
                              </p>
                              <p className="font-mono text-sm font-bold text-green-700">
                                ₡
                                {resultado.montoAguinaldo.toLocaleString(
                                  "es-CR",
                                )}
                              </p>
                            </div>
                            <div className="flex items-center justify-end">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
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
        </div>

        {/* FOOTER */}
        <DialogFooter>
          {step === "config" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleCalcular} disabled={isCalculating}>
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    {modoCalculo === "hasta-hoy"
                      ? "Calcular hasta hoy"
                      : "Calcular Aguinaldos"}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("config")}>
                Volver
              </Button>
              <Button
                onClick={handleConfirmar}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Aceptar y cerrar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
