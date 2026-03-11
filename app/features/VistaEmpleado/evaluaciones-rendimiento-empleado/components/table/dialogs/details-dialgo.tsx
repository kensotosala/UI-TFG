"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, User, Calendar, MessageSquare, BarChart2 } from "lucide-react";
import type { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const scoreToStars = (score: number): number => Math.round(score / 20);

const STAR_LABELS: Record<number, string> = {
  1: "Deficiente",
  2: "Regular",
  3: "Aceptable",
  4: "Bueno",
  5: "Excelente",
};

const ESTADO_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDIENTE: { label: "Pendiente", variant: "secondary" },
  COMPLETADA: { label: "Completada", variant: "default" },
  ANULADA: { label: "Anulada", variant: "destructive" },
  APROBADA: { label: "Aprobada", variant: "outline" },
};

const getPuntuacionLabel = (p: number): string => {
  if (p >= 80) return "Excelente";
  if (p >= 60) return "Aceptable";
  if (p >= 40) return "Regular";
  return "Deficiente";
};

const getPuntuacionColor = (p: number): string => {
  if (p >= 80) return "text-green-600 dark:text-green-400";
  if (p >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (p >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

// ── StarDisplay ───────────────────────────────────────────────────────────────

function StarDisplay({ score }: { score: number }) {
  const stars = scoreToStars(score);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < stars
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {STAR_LABELS[stars] ?? "—"}
      </span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DetailsDialog({
  open,
  onOpenChange,
  evaluacion,
}: DetailsDialogProps) {
  if (!evaluacion) return null;

  const estadoCfg = ESTADO_CONFIG[evaluacion.estado] ?? {
    label: evaluacion.estado,
    variant: "outline" as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                Detalle de Evaluación
                <span className="font-mono text-sm text-muted-foreground">
                  #{evaluacion.idEvaluacion}
                </span>
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                Resultado de tu evaluación de rendimiento.
              </DialogDescription>
            </div>
            <Badge variant={estadoCfg.variant} className="shrink-0">
              {estadoCfg.label}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="px-6 py-5 space-y-5">
            {/* ── Puntuación total destacada ── */}
            <div className="rounded-lg bg-muted/40 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-sm">Puntuación Total</span>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${getPuntuacionColor(evaluacion.puntuacionTotal)}`}
                >
                  {evaluacion.puntuacionTotal}
                  <span className="text-base font-normal text-muted-foreground">
                    /100
                  </span>
                </p>
                <p
                  className={`text-xs font-medium ${getPuntuacionColor(evaluacion.puntuacionTotal)}`}
                >
                  {getPuntuacionLabel(evaluacion.puntuacionTotal)}
                </p>
              </div>
            </div>

            {/* ── Evaluador y período ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
                  <User className="h-3 w-3" /> Evaluador
                </p>
                <p className="font-semibold text-sm">
                  {evaluacion.nombreEvaluador}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {evaluacion.evaluadorId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Período
                </p>
                <p className="font-semibold text-sm">
                  {formatDate(evaluacion.fechaInicio)}
                </p>
                <p className="text-xs text-muted-foreground">
                  hasta {formatDate(evaluacion.fechaFin)}
                </p>
              </div>
            </div>

            {/* ── Comentarios generales ── */}
            {evaluacion.comentarios && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Comentarios
                </p>
                <p className="text-sm bg-muted/30 rounded-md px-3 py-2">
                  {evaluacion.comentarios}
                </p>
              </div>
            )}

            <Separator />

            {/* ── Detalles por métrica ── */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                Métricas evaluadas ({evaluacion.detalles.length})
              </h4>

              {evaluacion.detalles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
                  Sin métricas registradas.
                </p>
              ) : (
                evaluacion.detalles.map((detalle) => (
                  <div
                    key={detalle.idDetalle}
                    className="border rounded-lg p-4 space-y-2 bg-muted/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">
                        {detalle.nombreMetrica ||
                          `Métrica #${detalle.idMetrica}`}
                      </p>
                      <StarDisplay score={detalle.puntuacion} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Puntuación: {detalle.puntuacion}/100</span>
                    </div>

                    {detalle.comentarios && (
                      <p className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                        {detalle.comentarios}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ── Fechas de auditoría ── */}
            <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Creada: {formatDate(evaluacion.fechaCreacion)}</span>
              <span>
                Modificada: {formatDate(evaluacion.fechaModificacion)}
              </span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
