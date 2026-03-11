"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { useCreateEvaluacionRendimiento } from "../../../hooks/useEvaluacionesRendimientoMutations";
import { ESTADOS_EVALUACION } from "../../../types";
import { StarRating, starsToScore } from "../star-rating";
import type { CreateEvaluacionDto, EstadoEvaluacion } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useMetricasRendimiento } from "@/lib/useMetricasRendimiento";

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface DetalleCreateFormValues {
  idMetrica: number | undefined;
  estrellas: number | undefined;
  comentarios: string;
}

interface CreateFormValues {
  empleadoId: number | undefined;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoEvaluacion;
  comentarios: string;
  detalles: DetalleCreateFormValues[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const asNumber = (val: unknown): number | undefined => {
  if (val === undefined || val === null || val === "") return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
};

// Convierte el string que devuelve <Select> onValueChange a number
// Select siempre entrega string, incluso si pusimos value={String(id)}
const parseSelectId = (val: string): number | undefined => {
  if (!val || val === "") return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) ? undefined : n;
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA ZOD — solo validación runtime
// ─────────────────────────────────────────────────────────────────────────────

const detalleSchema = z.object({
  idMetrica: z
    .preprocess(
      asNumber,
      z.number().int().positive("IdMetrica debe ser mayor a 0."),
    )
    .optional()
    .refine((v) => v !== undefined && v > 0, "IdMetrica requerida."),
  estrellas: z
    .number()
    .int()
    .min(1, "Selecciona al menos 1 estrella.")
    .max(5, "Máximo 5 estrellas.")
    .optional()
    .refine((v) => v !== undefined && v >= 1, "La calificación es requerida."),
  comentarios: z.string().max(500).default(""),
});

const createSchema = z
  .object({
    empleadoId: z
      .preprocess(asNumber, z.number().int().positive())
      .optional()
      .refine((v) => v !== undefined && v > 0, "Selecciona un empleado."),
    fechaInicio: z.string().min(1, "Fecha de inicio requerida."),
    fechaFin: z.string().min(1, "Fecha de fin requerida."),
    estado: z.enum(ESTADOS_EVALUACION, { error: "Estado inválido." }),
    comentarios: z.string().max(1000).default(""),
    detalles: z.array(detalleSchema),
  })

  .refine(
    (data) =>
      !data.fechaInicio ||
      !data.fechaFin ||
      new Date(data.fechaInicio) < new Date(data.fechaFin),
    {
      message: "La fecha de inicio debe ser anterior a la fecha de fin.",
      path: ["fechaFin"],
    },
  );

// ─────────────────────────────────────────────────────────────────────────────
// VALORES POR DEFECTO
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM_VALUES: CreateFormValues = {
  empleadoId: undefined,
  fechaInicio: "",
  fechaFin: "",
  estado: "PENDIENTE",
  comentarios: "",
  detalles: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface CreateEvaluacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CreateEvaluacionDialog({
  open,
  onOpenChange,
}: CreateEvaluacionDialogProps) {
  const { mutate: createEvaluacion, isPending } =
    useCreateEvaluacionRendimiento();

  const { user } = useAuthContext();
  const { empleados, isLoading: isLoadingEmpleados } = useEmpleados();

  const {
    data: metricas,
    isLoading: isLoadingMetricas,
    error: errorMetricas,
  } = useMetricasRendimiento();

  const form = useForm<CreateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createSchema) as any,
    defaultValues: EMPTY_FORM_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  useEffect(() => {
    if (!open) form.reset(EMPTY_FORM_VALUES);
  }, [open, form]);

  const onSubmit = (values: CreateFormValues) => {
    if (values.empleadoId === undefined || user?.employeeId === undefined)
      return;

    const dto: CreateEvaluacionDto = {
      empleadoId: values.empleadoId,
      evaluadorId: user.employeeId,
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      comentarios: values.comentarios.trim() || undefined,
      detalles: values.detalles.map((d) => ({
        idMetrica: d.idMetrica!,
        puntuacion: starsToScore(d.estrellas!),
        comentarios: d.comentarios.trim() || undefined,
      })),
    };

    createEvaluacion(dto, {
      onSuccess: (result) => {
        if (result.exitoso) onOpenChange(false);
      },
    });
  };

  const renderEmpleadoOptions = (excludeId?: number) => {
    if (isLoadingEmpleados) {
      return (
        <SelectItem value="__loading__" disabled>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Cargando empleados...
          </span>
        </SelectItem>
      );
    }

    if (empleados.length === 0) {
      return (
        <SelectItem value="__empty__" disabled>
          <span className="text-muted-foreground">
            No hay empleados disponibles
          </span>
        </SelectItem>
      );
    }

    return empleados
      .filter((e) => e.idEmpleado !== excludeId)
      .map((empleado) => (
        <SelectItem
          key={empleado.idEmpleado}
          value={String(empleado.idEmpleado)}
        >
          <span className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>
              {empleado.nombre} {empleado.primerApellido}
              <span className="text-xs text-muted-foreground ml-1.5">
                #{empleado.idEmpleado}
              </span>
            </span>
          </span>
        </SelectItem>
      ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Evaluación de Rendimiento</DialogTitle>
          <DialogDescription>
            Registra una evaluación de rendimiento para un empleado. Solo se
            permite una evaluación por empleado por año.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* ── Selects de empleado y evaluador ───────────────── */}
            <div className="grid grid-cols-2 gap-4">
              {/* Empleado evaluado */}
              <FormField
                control={form.control}
                name="empleadoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empleado Evaluado *</FormLabel>
                    <Select
                      // Fix Error 3: Select maneja strings; convertimos a number al recibir
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
                      onValueChange={(val) =>
                        field.onChange(parseSelectId(val))
                      }
                      disabled={isLoadingEmpleados}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {isLoadingEmpleados ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Cargando...
                            </span>
                          ) : (
                            <SelectValue placeholder="Selecciona un empleado" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Fix Error 1: excluye al evaluador ya seleccionado */}
                        {renderEmpleadoOptions(user?.employeeId)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fechas */}
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Inicio *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Fecha Fin *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comentarios */}
            <FormField
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones generales de la evaluación..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* ── Métricas con Star Rating ───────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Métricas evaluadas ({fields.length})
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      idMetrica: undefined,
                      estrellas: undefined,
                      comentarios: "",
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Agregar métrica
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
                  No hay métricas. Agrega al menos una para registrar
                  puntuaciones.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 border rounded-lg bg-muted/20"
                >
                  {/* Campo ID Métrica como Select */}
                  <FormField
                    control={form.control}
                    name={`detalles.${index}.idMetrica`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Métrica *</FormLabel>
                        <Select
                          value={
                            field.value !== undefined ? String(field.value) : ""
                          }
                          onValueChange={(val) =>
                            field.onChange(parseSelectId(val))
                          }
                          disabled={isLoadingMetricas}
                        >
                          <FormControl>
                            <SelectTrigger>
                              {isLoadingMetricas ? (
                                <span className="flex items-center gap-2 text-muted-foreground">
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Cargando...
                                </span>
                              ) : (
                                <SelectValue placeholder="Selecciona una métrica" />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingMetricas ? (
                              <SelectItem value="__loading__" disabled>
                                <span className="flex items-center gap-2 text-muted-foreground">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Cargando métricas...
                                </span>
                              </SelectItem>
                            ) : errorMetricas ? (
                              <SelectItem value="__error__" disabled>
                                <span className="text-destructive">
                                  Error al cargar métricas
                                </span>
                              </SelectItem>
                            ) : metricas && metricas.length > 0 ? (
                              metricas.map((metrica) => (
                                <SelectItem
                                  key={metrica.idMetrica}
                                  value={String(metrica.idMetrica)}
                                >
                                  {metrica.nombreMetrica}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="__empty__" disabled>
                                <span className="text-muted-foreground">
                                  No hay métricas disponibles
                                </span>
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`detalles.${index}.estrellas`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Calificación *
                          </FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value ?? 0}
                              onChange={field.onChange}
                              size="md"
                              showLabel
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`detalles.${index}.comentarios`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Comentario</FormLabel>
                          <FormControl>
                            <Input placeholder="Opcional..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || isLoadingEmpleados}>
                {isPending ? "Guardando..." : "Crear Evaluación"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
