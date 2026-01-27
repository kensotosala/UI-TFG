"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertCircle, Info } from "lucide-react";
import { SaldoVacacionesDTO } from "../../../vacaciones.types";

interface VacacionCreateDialogEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { fechaInicio: string; fechaFin: string }) => Promise<void>;
  saldo: SaldoVacacionesDTO | null;
}

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const calcularDias = (inicio: string, fin: string): number => {
  if (!inicio || !fin) return 0;
  const startDate = new Date(inicio);
  const endDate = new Date(fin);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const vacacionSchema = z
  .object({
    fechaInicio: z
      .string()
      .min(1, "La fecha de inicio es obligatoria")
      .refine((fecha) => {
        const vacacion = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return vacacion >= hoy;
      }, "La fecha de inicio debe ser hoy o posterior"),
    fechaFin: z
      .string()
      .min(1, "La fecha de fin es obligatoria")
      .refine((fecha) => {
        const vacacion = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return vacacion >= hoy;
      }, "La fecha de fin debe ser hoy o posterior"),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      return fin >= inicio;
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["fechaFin"],
    },
  );

type VacacionFormValues = z.infer<typeof vacacionSchema>;

export function VacacionCreateDialogEmpleado({
  open,
  onOpenChange,
  onCreate,
  saldo,
}: VacacionCreateDialogEmpleadoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VacacionFormValues>({
    resolver: zodResolver(vacacionSchema),
    defaultValues: {
      fechaInicio: "",
      fechaFin: "",
    },
  });

  const watchFechaInicio = form.watch("fechaInicio");
  const watchFechaFin = form.watch("fechaFin");
  const diasSolicitados = calcularDias(watchFechaInicio, watchFechaFin);
  const diasDisponibles = saldo?.diasDisponibles || 0;
  const excedeDiasDisponibles = diasSolicitados > diasDisponibles;

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: VacacionFormValues) => {
    setIsSubmitting(true);
    try {
      await onCreate(values);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Solicitar Vacaciones
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {saldo && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Días disponibles: {saldo.diasDisponibles}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Acumulados: {saldo.diasAcumulados} | Disfrutados:{" "}
                      {saldo.diasDisfrutados}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio*</FormLabel>
                    <FormControl>
                      <Input type="date" min={getTodayString()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin*</FormLabel>
                    <FormControl>
                      <Input type="date" min={watchFechaInicio} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {diasSolicitados > 0 && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Días solicitados:</span>
                  <span
                    className={`text-lg font-bold ${
                      excedeDiasDisponibles ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {diasSolicitados} día{diasSolicitados !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Quedarían: {Math.max(0, diasDisponibles - diasSolicitados)}{" "}
                  día(s) disponibles
                </div>
              </div>
            )}

            {excedeDiasDisponibles && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No tienes suficientes días disponibles. Solicitas{" "}
                  {diasSolicitados} días pero solo tienes {diasDisponibles}{" "}
                  disponibles.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || excedeDiasDisponibles}
              >
                {isSubmitting ? "Guardando..." : "Solicitar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
