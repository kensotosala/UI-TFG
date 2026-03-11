// features/evaluaciones-rendimiento/components/data-table/dialogs/details-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Calendar,
  Star,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useEvaluacionRendimiento } from "../../../hooks/useEvaluacionesRendimiento";
import type { EvaluacionRendimientoResponse } from "../../../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short", // "short" en lugar de "long" ahorra espacio horizontal
    year: "numeric",
  });

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Score → color y etiqueta ─────────────────────────────────────────────────

const getPuntuacionColor = (p: number) => {
  if (p >= 80) return "text-green-600";
  if (p >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getPuntuacionLabel = (p: number) => {
  if (p >= 80) return "Excelente";
  if (p >= 60) return "Aceptable";
  if (p >= 40) return "Regular";
  return "Deficiente";
};

// Score → estrellas (1–5) para visualización readonly
const scoreToStars = (score: number): number => Math.round(score / 20);

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/**
 * Fila de dato etiqueta–valor para secciones de información.
 * Usa min-w-[7rem] (clase arbitraria válida) en lugar de min-w-30 inválido.
 */
function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-xs text-muted-foreground min-w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-right leading-snug">
        {children}
      </span>
    </div>
  );
}

/** Estrellas readonly pequeñas para la tabla de métricas */
function StarDisplay({ score }: { score: number }) {
  const stars = scoreToStars(score);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= stars
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-7 w-full ${i % 2 === 0 ? "w-3/4" : ""}`}
        />
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DetailsEvaluacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DetailsEvaluacionDialog({
  open,
  onOpenChange,
  evaluacion,
}: DetailsEvaluacionDialogProps) {
  const {
    data: detalleCompleto,
    isLoading,
    isError,
  } = useEvaluacionRendimiento(
    open ? (evaluacion?.idEvaluacion ?? null) : null,
  );

  const data = detalleCompleto ?? evaluacion;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b bg-background sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2">
            Detalle de Evaluación
            {data && (
              <Badge variant="outline" className="font-mono text-xs">
                #{data.idEvaluacion}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Información completa de la evaluación de rendimiento.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] px-6 py-5 space-y-4">
          {/* Loading */}
          {isLoading && <DetailsSkeleton />}

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              No se pudo cargar el detalle actualizado.
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Estado y fecha de modificación */}
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Estado
                  </p>
                  <Badge
                    variant={
                      data.estado === "APROBADA" ? "default" : "destructive"
                    }
                    className="text-xs px-2.5 py-0.5"
                  >
                    {data.estado}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(data.fechaModificacion)}
                  </p>
                </div>

                {/* Puntuación total — compacto, sin text-4xl innecesario */}
                <div className="rounded-lg border p-3 flex flex-col items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Puntuación total
                  </p>
                  <p
                    className={`text-3xl font-bold ${getPuntuacionColor(data.puntuacionTotal)}`}
                  >
                    {data.puntuacionTotal}
                    <span className="text-sm text-muted-foreground font-normal ml-1">
                      /100
                    </span>
                  </p>
                  <span
                    className={`text-xs font-medium ${getPuntuacionColor(data.puntuacionTotal)}`}
                  >
                    {getPuntuacionLabel(data.puntuacionTotal)}
                  </span>
                </div>
              </div>

              {/* ── Participantes + Período en dos columnas ─────── */}
              {/* Aprovecha el ancho max-w-2xl para mostrar más info sin scroll */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-muted-foreground uppercase tracking-wide">
                    <User className="h-3.5 w-3.5" /> Participantes
                  </h4>
                  <InfoRow label="Empleado">
                    <span>
                      {data.nombreEmpleado}
                      <span className="block text-xs text-muted-foreground font-normal">
                        ID: {data.empleadoId}
                      </span>
                    </span>
                  </InfoRow>
                  <InfoRow label="Evaluador">
                    <span>
                      {data.nombreEvaluador}
                      <span className="block text-xs text-muted-foreground font-normal">
                        ID: {data.evaluadorId}
                      </span>
                    </span>
                  </InfoRow>
                </div>

                <div className="rounded-lg border p-3">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-muted-foreground uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5" /> Período
                  </h4>
                  <InfoRow label="Inicio">
                    {formatDate(data.fechaInicio)}
                  </InfoRow>
                  <InfoRow label="Fin">{formatDate(data.fechaFin)}</InfoRow>
                  <InfoRow label="Creado">
                    {formatDateTime(data.fechaCreacion)}
                  </InfoRow>
                </div>
              </div>

              {/* ── Comentarios (solo si existen) ─────────────────── */}
              {data.comentarios && (
                <div className="rounded-lg border p-3">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-muted-foreground uppercase tracking-wide">
                    <MessageSquare className="h-3.5 w-3.5" /> Comentarios
                    Generales
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.comentarios}
                  </p>
                </div>
              )}

              {/* ── Métricas — tarjetas en lugar de tabla ─────────── */}
              <div>
                <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-3 text-muted-foreground uppercase tracking-wide">
                  <Star className="h-3.5 w-3.5" /> Métricas Evaluadas
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {data.detalles.length}
                  </Badge>
                </h4>

                {data.detalles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg border-dashed">
                    Sin métricas registradas.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {data.detalles.map((detalle) => (
                      <div
                        key={detalle.idDetalle}
                        className="rounded-lg border px-4 py-3 flex items-center justify-between gap-4"
                      >
                        {/* Info de la métrica */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              #{detalle.idDetalle}
                            </span>
                            <p className="text-sm font-medium truncate">
                              {detalle.nombreMetrica ||
                                `Métrica #${detalle.idMetrica}`}
                            </p>
                          </div>
                          {detalle.comentarios ? (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {detalle.comentarios}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground/50 mt-1 italic">
                              Sin comentario
                            </p>
                          )}
                        </div>

                        {/* Calificación: estrellas + score */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StarDisplay score={detalle.puntuacion} />
                          <span
                            className={`text-xs font-semibold tabular-nums ${getPuntuacionColor(detalle.puntuacion)}`}
                          >
                            {detalle.puntuacion}
                            <span className="text-muted-foreground font-normal">
                              /100
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
