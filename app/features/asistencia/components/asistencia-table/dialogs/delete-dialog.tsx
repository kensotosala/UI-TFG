// components/asistencias/AsistenciaDeleteDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AsistenciaDetallada } from "../../../types";

interface AsistenciaDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistencia: AsistenciaDetallada | null;
  onConfirm: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function AsistenciaDeleteDialog({
  open,
  onOpenChange,
  asistencia,
  onConfirm,
  isDeleting = false,
}: AsistenciaDeleteDialogProps) {
  if (!asistencia) return null;

  const handleDelete = async () => {
    await onConfirm(asistencia.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle className="text-red-600">
              Eliminar Registro de Asistencia
            </DialogTitle>
          </div>
          <DialogDescription className="space-y-4 pt-4">
            <p>
              ¿Estás seguro de que deseas eliminar el registro de asistencia?
            </p>

            {/* Información del registro */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {asistencia.empleado.nombreCompleto}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {format(
                    new Date(asistencia.fecha),
                    "dd 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Estado:</span>
                <Badge variant="outline">{asistencia.estado}</Badge>
              </div>
            </div>

            <p className="text-sm text-red-500 font-medium">
              ⚠️ Esta acción no se puede deshacer.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
