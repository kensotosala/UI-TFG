// features/evaluaciones-rendimiento/components/data-table/dialogs/edit-dialog.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Plus, Trash2 } from "lucide-react";
import { useUpdateEvaluacionRendimiento } from "../../../hooks/useEvaluacionesRendimientoMutations";
import { ESTADOS_EVALUACION } from "../../../types";
import type {
  EvaluacionRendimientoResponse,
  EstadoEvaluacion,
  UpdateEvaluacionDto,
} from "../../../types";
import { scoreToStars, StarRating, starsToScore } from "../star-rating";
import { useMetricasRendimiento } from "@/lib/useMetricasRendimiento";

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface DetalleUpdateFormValues {
  idDetalle: number;
  idMetrica: number | undefined;
  estrellas: number | undefined;
  comentarios: string;
}

interface UpdateFormValues {
  idEvaluacion: number;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoEvaluacion;
  comentarios: string;
  detalles: DetalleUpdateFormValues[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const toNumber = (val: unknown): number | undefined => {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "number") return val;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

const toDateInputValue = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Select siempre entrega string → convertimos a number
const parseSelectId = (val: string): number | undefined => {
  if (!val || val === "") return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) ? undefined : n;
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA ZOD
// ─────────────────────────────────────────────────────────────────────────────

const detalleUpdateSchema = z.object({
  idDetalle: z.number().int().min(0),
  idMetrica: z
    .preprocess(toNumber, z.number().int().positive("Debe ser mayor a 0"))
    .optional()
    .refine((v) => v !== undefined && v > 0, "Métrica requerida."),
  estrellas: z
    .preprocess(
      toNumber,
      z.number().int().min(1, "Mínimo 1 estrella").max(5, "Máximo 5 estrellas"),
    )
    .optional()
    .refine((v) => v !== undefined && v >= 1, "Calificación requerida."),
  comentarios: z.string().max(500, "Máximo 500 caracteres").default(""),
});

const updateSchema = z
  .object({
    idEvaluacion: z.number().int().positive(),
    fechaInicio: z.string().min(1, "Fecha inicio requerida."),
    fechaFin: z.string().min(1, "Fecha fin requerida."),
    estado: z.enum(ESTADOS_EVALUACION, { error: "Estado inválido." }),
    comentarios: z.string().max(1000, "Máximo 1000 caracteres").default(""),
    detalles: z
      .array(detalleUpdateSchema)
      .min(1, "Agrega al menos una métrica."),
  })
  .refine(
    (data) => {
      if (!data.fechaInicio || !data.fechaFin) return true;
      return new Date(data.fechaInicio) < new Date(data.fechaFin);
    },
    {
      message: "Fecha inicio debe ser anterior a fecha fin.",
      path: ["fechaFin"],
    },
  );

// ─────────────────────────────────────────────────────────────────────────────
// VALORES POR DEFECTO
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM_VALUES: UpdateFormValues = {
  idEvaluacion: 0,
  fechaInicio: "",
  fechaFin: "",
  estado: "PENDIENTE",
  comentarios: "",
  detalles: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS de métrica para el sub-componente
// ─────────────────────────────────────────────────────────────────────────────

interface Metrica {
  idMetrica: number;
  nombreMetrica: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: fila de detalle con Select de métrica
// ─────────────────────────────────────────────────────────────────────────────

interface DetalleItemProps {
  control: any;
  index: number;
  onRemove: () => void;
  isExisting: boolean;
  // Props para el Select de métricas (igual que en create)
  metricas: Metrica[] | undefined;
  isLoadingMetricas: boolean;
  errorMetricas: Error | null;
  metricasSeleccionadas: Set<number>; // para deshabilitar duplicados
}

const DetalleItem = ({
  control,
  index,
  onRemove,
  isExisting,
  metricas,
  isLoadingMetricas,
  errorMetricas,
  metricasSeleccionadas,
}: DetalleItemProps) => (
  <div
    className={`grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 border rounded-lg ${
      isExisting
        ? "bg-muted/20"
        : "bg-green-50 dark:bg-green-950/20 border-green-200"
    }`}
  >
    {/* ── Select de métrica — idéntico al create ── */}
    <FormField
      control={control}
      name={`detalles.${index}.idMetrica`}
      render={({ field }) => {
        // No auto-excluirse a sí misma al filtrar duplicados
        const yaUsada = (id: number) =>
          metricasSeleccionadas.has(id) && id !== field.value;

        return (
          <FormItem className="w-44">
            <FormLabel className="text-xs flex items-center gap-1">
              Métrica *
              {!isExisting && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Nuevo
                </Badge>
              )}
            </FormLabel>
            <Select
              value={field.value !== undefined ? String(field.value) : ""}
              onValueChange={(val) => field.onChange(parseSelectId(val))}
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
                      disabled={yaUsada(metrica.idMetrica)}
                    >
                      <span
                        className={
                          yaUsada(metrica.idMetrica)
                            ? "text-muted-foreground line-through"
                            : ""
                        }
                      >
                        {metrica.nombreMetrica}
                      </span>
                      {yaUsada(metrica.idMetrica) && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (ya agregada)
                        </span>
                      )}
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
        );
      }}
    />

    {/* ── Calificación + Comentario ── */}
    <div className="space-y-2">
      <FormField
        control={control}
        name={`detalles.${index}.estrellas`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Calificación *</FormLabel>
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
        control={control}
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
        onClick={onRemove}
        title="Eliminar detalle"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface EditEvaluacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EditEvaluacionDialog({
  open,
  onOpenChange,
  evaluacion,
}: EditEvaluacionDialogProps) {
  const { mutate: updateEvaluacion, isPending } =
    useUpdateEvaluacionRendimiento();

  // Métricas — mismo hook que en create
  const {
    data: metricas,
    isLoading: isLoadingMetricas,
    error: errorMetricas,
  } = useMetricasRendimiento();

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema) as any,
    defaultValues: EMPTY_FORM_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  // Índices de detalles que ya existían (idDetalle > 0)
  const existingDetalleIds = useMemo(() => {
    return new Set(
      fields
        .map((f) => (f as any).idDetalle as number)
        .map((idDetalle, idx) => (idDetalle > 0 ? idx : -1))
        .filter((idx) => idx >= 0),
    );
  }, [fields]);

  // Set de métricas ya seleccionadas en otras filas → para deshabilitar duplicados
  const metricasSeleccionadas = useMemo(() => {
    return new Set(
      form
        .getValues("detalles")
        .map((d) => d.idMetrica)
        .filter((id): id is number => id !== undefined),
    );
    // fields como dep para re-calcular cuando se agrega/quita/cambia una fila
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, form]);

  useEffect(() => {
    if (open && evaluacion) {
      form.reset({
        idEvaluacion: evaluacion.idEvaluacion,
        fechaInicio: toDateInputValue(evaluacion.fechaInicio),
        fechaFin: toDateInputValue(evaluacion.fechaFin),
        estado: evaluacion.estado,
        comentarios: evaluacion.comentarios ?? "",
        detalles: evaluacion.detalles.map((d) => ({
          idDetalle: d.idDetalle,
          idMetrica: d.idMetrica,
          estrellas: scoreToStars(d.puntuacion),
          comentarios: d.comentarios ?? "",
        })),
      });
    } else if (!open) {
      form.reset(EMPTY_FORM_VALUES);
    }
  }, [open, evaluacion, form]);

  const onSubmit = useCallback(
    (values: UpdateFormValues) => {
      if (!evaluacion?.evaluadorId) return;

      const dto: UpdateEvaluacionDto = {
        idEvaluacion: values.idEvaluacion,
        evaluadorId: evaluacion.evaluadorId,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        estado: values.estado,
        comentarios: values.comentarios.trim() || undefined,
        detalles: values.detalles.map((d) => ({
          idDetalle: d.idDetalle,
          idMetrica: d.idMetrica!,
          puntuacion: starsToScore(d.estrellas!),
          comentarios: d.comentarios.trim() || undefined,
        })),
      };

      updateEvaluacion(
        { id: values.idEvaluacion, data: dto },
        {
          onSuccess: (result) => {
            if (result.exitoso) {
              onOpenChange(false);
              form.reset(EMPTY_FORM_VALUES);
            }
          },
        },
      );
    },
    [evaluacion, updateEvaluacion, onOpenChange, form],
  );

  const handleAppend = useCallback(() => {
    append({
      idDetalle: 0,
      idMetrica: undefined,
      estrellas: undefined,
      comentarios: "",
    });
  }, [append]);

  const handleRemove = useCallback((index: number) => remove(index), [remove]);

  if (!evaluacion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Evaluación
            <Badge variant="outline" className="font-mono text-xs">
              #{evaluacion.idEvaluacion}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Modifica los datos de la evaluación de{" "}
            <strong>{evaluacion.nombreEmpleado}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* ── Readonly: empleado y evaluador ────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-muted/40 px-4 py-3 text-sm space-y-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Empleado evaluado
                </p>
                <p className="font-semibold">{evaluacion.nombreEmpleado}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  ID: {evaluacion.empleadoId} · No modificable
                </p>
              </div>
              <div className="rounded-md bg-muted/40 px-4 py-3 text-sm space-y-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Evaluador
                </p>
                <p className="font-semibold">{evaluacion.nombreEvaluador}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  ID: {evaluacion.evaluadorId} · No modificable
                </p>
              </div>
            </div>

            {/* ── Fechas ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* ── Estado ────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_EVALUACION.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Comentarios ───────────────────────────────────── */}
            <FormField
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Comentarios generales..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* ── Métricas ──────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Métricas ({fields.length})
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAppend}
                  disabled={isLoadingMetricas}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Agregar métrica
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
                  Sin métricas. Los detalles eliminados se borrarán al guardar.
                </p>
              )}

              {fields.map((field, index) => (
                <DetalleItem
                  key={field.id}
                  control={form.control}
                  index={index}
                  onRemove={() => handleRemove(index)}
                  isExisting={existingDetalleIds.has(index)}
                  metricas={metricas}
                  isLoadingMetricas={isLoadingMetricas}
                  errorMetricas={errorMetricas}
                  metricasSeleccionadas={metricasSeleccionadas}
                />
              ))}

              {form.formState.errors.detalles?.root?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.detalles.root.message}
                </p>
              )}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
