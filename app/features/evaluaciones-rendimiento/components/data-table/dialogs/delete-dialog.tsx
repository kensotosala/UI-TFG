"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useDeleteEvaluacionRendimiento } from "../../../hooks/useEvaluacionesRendimientoMutations";
import type { EvaluacionRendimientoResponse } from "../../../types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeleteEvaluacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeleteEvaluacionDialog({
  open,
  onOpenChange,
  evaluacion,
}: DeleteEvaluacionDialogProps) {
  const { mutate: deleteEvaluacion, isPending } =
    useDeleteEvaluacionRendimiento();

  const handleConfirm = () => {
    if (!evaluacion) return;
    deleteEvaluacion(evaluacion.idEvaluacion, {
      onSuccess: (result) => {
        if (result.exitoso) onOpenChange(false);
      },
    });
  };

  if (!evaluacion) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Anular Evaluación
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Estás a punto de anular la siguiente evaluación. Esta acción
                cambiará el estado a{" "}
                <Badge variant="destructive" className="text-xs">
                  ANULADA
                </Badge>{" "}
                y no podrá revertirse fácilmente.
              </p>
              {/* Resumen de la evaluación */}
              <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono font-medium">
                    #{evaluacion.idEvaluacion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empleado:</span>
                  <span className="font-medium">
                    {evaluacion.nombreEmpleado}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evaluador:</span>
                  <span>{evaluacion.nombreEvaluador}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Puntuación:</span>
                  <span className="font-semibold">
                    {evaluacion.puntuacionTotal}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado actual:</span>
                  <Badge variant="default" className="text-xs">
                    {evaluacion.estado}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠ Las evaluaciones anuladas no pueden ser editadas ni anuladas
                nuevamente.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Anulando..." : "Sí, anular evaluación"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
