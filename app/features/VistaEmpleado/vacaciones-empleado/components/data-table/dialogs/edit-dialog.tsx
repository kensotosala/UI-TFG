/* eslint-disable react-hooks/incompatible-library */
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Info } from "lucide-react";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import {
  ActualizarVacacionDTO,
  ListarVacacionesDTO,
} from "../../../vacaciones.types";
import { useSaldoVacacionesQuery } from "../../../queries/vacaciones.queries";

interface VacacionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacacion: ListarVacacionesDTO | null;
  onUpdate: (data: ActualizarVacacionDTO) => Promise<void>;
}

const formatDateForInput = (isoDate: string): string => {
  return isoDate.split("T")[0];
};

const calcularDias = (inicio: string, fin: string): number => {
  if (!inicio || !fin) return 0;
  const startDate = new Date(inicio);
  const endDate = new Date(fin);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const vacacionUpdateSchema = z
  .object({
    empleadoId: z.number().min(1, "Debes seleccionar un empleado"),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().min(1, "La fecha de fin es obligatoria"),
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

type VacacionUpdateFormValues = z.infer<typeof vacacionUpdateSchema>;

export function VacacionEditDialog({
  open,
  onOpenChange,
  vacacion,
  onUpdate,
}: VacacionEditDialogProps) {
  const { empleados = [] } = useEmpleados();
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number>(0);

  const { data: saldoData } = useSaldoVacacionesQuery(
    selectedEmpleadoId,
    new Date().getFullYear(),
    selectedEmpleadoId > 0,
  );

  const form = useForm<VacacionUpdateFormValues>({
    resolver: zodResolver(vacacionUpdateSchema),
    defaultValues: {
      empleadoId: 0,
      fechaInicio: "",
      fechaFin: "",
    },
  });

  useEffect(() => {
    if (vacacion && open) {
      const empleadoId = vacacion.empleadoId;
      setSelectedEmpleadoId(empleadoId);

      form.reset({
        empleadoId,
        fechaInicio: formatDateForInput(vacacion.fechaInicio),
        fechaFin: formatDateForInput(vacacion.fechaFin),
      });
    }
  }, [vacacion, open, form]);

  const watchFechaInicio = form.watch("fechaInicio");
  const watchFechaFin = form.watch("fechaFin");
  const diasSolicitados = calcularDias(watchFechaInicio, watchFechaFin);

  const saldo = saldoData?.datos;
  const diasDisponibles = saldo?.diasDisponibles || 0;

  const diasOriginales = vacacion
    ? calcularDias(
        formatDateForInput(vacacion.fechaInicio),
        formatDateForInput(vacacion.fechaFin),
      )
    : 0;

  const diasAdicionales = diasSolicitados - diasOriginales;
  const excedeDiasDisponibles = diasAdicionales > diasDisponibles;

  const handleClose = () => {
    form.reset();
    setSelectedEmpleadoId(0);
    onOpenChange(false);
  };

  const onSubmit = async (values: VacacionUpdateFormValues) => {
    if (!vacacion) return;

    try {
      const payload: ActualizarVacacionDTO = {
        empleadoId: values.empleadoId,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
      };

      await onUpdate(payload);
      handleClose();
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      alert(`No se pudo actualizar la solicitud: ${mensaje}`);
    }
  };

  const isPendiente = vacacion?.estadoSolicitud === "PENDIENTE";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Editar Solicitud de Vacaciones
          </DialogTitle>
          <Separator />
        </DialogHeader>

        {!isPendiente && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Solo se pueden editar solicitudes en estado PENDIENTE. Esta
              solicitud está{" "}
              <strong>{vacacion?.estadoSolicitud || "procesada"}</strong>.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="empleadoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado*</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => {
                      const id = Number(v);
                      field.onChange(id);
                      setSelectedEmpleadoId(id);
                    }}
                    disabled={!isPendiente}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un empleado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {empleados.map((e) => (
                        <SelectItem
                          key={e.idEmpleado}
                          value={String(e.idEmpleado)}
                        >
                          {e.nombre} {e.primerApellido} {e.segundoApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedEmpleadoId > 0 && saldo && (
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
                      <Input type="date" {...field} disabled={!isPendiente} />
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
                      <Input
                        type="date"
                        min={watchFechaInicio}
                        {...field}
                        disabled={!isPendiente}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {vacacion && (
              <div className="space-y-2">
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Días originales:
                    </span>
                    <span className="text-lg font-bold text-gray-600">
                      {diasOriginales} día{diasOriginales !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Días nuevos:</span>
                    <span
                      className={`text-lg font-bold ${
                        excedeDiasDisponibles ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {diasSolicitados} día{diasSolicitados !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {diasAdicionales !== 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {diasAdicionales > 0
                            ? "Días adicionales:"
                            : "Días reducidos:"}
                        </span>
                        <span
                          className={`font-semibold ${
                            diasAdicionales > 0
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {diasAdicionales > 0 ? "+" : ""}
                          {diasAdicionales} día
                          {Math.abs(diasAdicionales) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedEmpleadoId > 0 && diasAdicionales > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Quedarían: {Math.max(0, diasDisponibles - diasAdicionales)}{" "}
                    día(s) disponibles
                  </div>
                )}
              </div>
            )}

            {excedeDiasDisponibles &&
              selectedEmpleadoId > 0 &&
              diasAdicionales > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    El cambio requiere {diasAdicionales} días adicionales pero
                    solo tienes {diasDisponibles} disponibles.
                  </AlertDescription>
                </Alert>
              )}

            {diasSolicitados > 14 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Estás solicitando más de 14 días consecutivos. Según la ley de
                  Costa Rica, el período máximo recomendado es de 2 semanas.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !isPendiente ||
                  excedeDiasDisponibles
                }
              >
                {form.formState.isSubmitting ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
