"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Incapacidad, TIPOS_INCAPACIDAD } from "../../../types";

interface IncapacidadDeleteDialogEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incapacidad: Incapacidad | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    [TIPOS_INCAPACIDAD.ENFERMEDAD]: "Enfermedad",
    [TIPOS_INCAPACIDAD.ACCIDENTE]: "Accidente",
    [TIPOS_INCAPACIDAD.MATERNIDAD]: "Maternidad",
    [TIPOS_INCAPACIDAD.PATERNIDAD]: "Paternidad",
  };
  return labels[tipo] || tipo;
};

export function IncapacidadDeleteDialogEmpleado({
  open,
  onOpenChange,
  incapacidad,
  isDeleting,
  onConfirm,
}: IncapacidadDeleteDialogEmpleadoProps) {
  if (!incapacidad) return null;

  const handleConfirm = async () => {
    await onConfirm(incapacidad.idIncapacidad);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Eliminar Incapacidad</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            registro de incapacidad.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm">
            <span className="font-medium">Tipo: </span>
            {getTipoLabel(incapacidad.tipoIncapacidad)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Estado: </span>
            {incapacidad.estado}
          </p>
          <p className="text-sm">
            <span className="font-medium">Fecha Inicio: </span>
            {new Date(incapacidad.fechaInicio).toLocaleDateString("es-CR")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Fecha Fin: </span>
            {new Date(incapacidad.fechaFin).toLocaleDateString("es-CR")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Diagnóstico: </span>
            <span className="line-clamp-2">{incapacidad.diagnostico}</span>
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
