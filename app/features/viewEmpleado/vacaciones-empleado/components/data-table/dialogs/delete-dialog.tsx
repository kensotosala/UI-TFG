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
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { ListarVacacionesDTO } from "../../../vacaciones.types";

interface VacacionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacacion: ListarVacacionesDTO | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

export function VacacionDeleteDialog({
  open,
  onOpenChange,
  vacacion,
  isDeleting,
  onConfirm,
}: VacacionDeleteDialogProps) {
  const { empleados } = useEmpleados();

  if (!vacacion) return null;

  const empleado = empleados.find((e) => e.idEmpleado === vacacion.empleadoId);

  const handleConfirm = async () => {
    await onConfirm(vacacion.idVacacion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Cancelar Solicitud de Vacaciones</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción no se puede deshacer. Se cancelará permanentemente la
            solicitud de vacaciones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm">
            <span className="font-medium">Empleado: </span>
            {empleado
              ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido || ""}`
              : "No encontrado"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Fecha Inicio: </span>
            {new Date(vacacion.fechaInicio).toLocaleDateString("es-CR")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Fecha Fin: </span>
            {new Date(vacacion.fechaFin).toLocaleDateString("es-CR")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Estado: </span>
            {vacacion.estadoSolicitud}
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
            {isDeleting ? "Cancelando..." : "Cancelar Solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
