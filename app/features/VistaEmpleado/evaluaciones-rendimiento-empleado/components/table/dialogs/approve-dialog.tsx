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
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAprobarEvaluacionRendimiento } from "@/app/features/evaluaciones-rendimiento/hooks/useEvaluacionesRendimientoMutations";
import type { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluacion: EvaluacionRendimientoResponse | null;
  onSuccess?: () => void;
}

export function ApproveDialog({
  open,
  onOpenChange,
  evaluacion,
  onSuccess,
}: ApproveDialogProps) {
  const { mutate: aprobarEvaluacion, isPending } =
    useAprobarEvaluacionRendimiento();

  if (!evaluacion) return null;

  const handleConfirm = () => {
    aprobarEvaluacion(evaluacion.idEvaluacion, {
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
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Aprobar evaluación
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Estás a punto de aprobar la evaluación{" "}
              <strong>#{evaluacion.idEvaluacion}</strong> con una puntuación de{" "}
              <strong>{evaluacion.puntuacionTotal}/100</strong>.
            </span>
            <span className="block text-muted-foreground">
              Esta acción confirma que revisaste y estás de acuerdo con los
              resultados. No podrá deshacerse.
            </span>
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
            variant="default"
            className="gap-2"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Aprobando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirmar aprobación
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
