"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useRechazarEvaluacionRendimiento } from "@/app/features/evaluaciones-rendimiento/hooks/useEvaluacionesRendimientoMutations";
import type { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
  onSuccess?: () => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  evaluacion,
  onSuccess,
}: RejectDialogProps) {
  const { mutate: rechazarEvaluacion, isPending } =
    useRechazarEvaluacionRendimiento();

  if (!evaluacion) return null;

  const handleConfirm = () => {
    rechazarEvaluacion(evaluacion.idEvaluacion, {
      onSuccess: (result) => {
        if (result.exitoso) {
          onOpenChange(false);
          onSuccess?.();
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Rechazar evaluación
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Estás a punto de rechazar la evaluación{" "}
                <strong>#{evaluacion.idEvaluacion}</strong> con una puntuación
                de <strong>{evaluacion.puntuacionTotal}/100</strong>.
              </p>
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                  Esta acción indica que no estás de acuerdo con los resultados.
                  El evaluador será notificado y no podrá deshacerse.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Confirmar rechazo
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
