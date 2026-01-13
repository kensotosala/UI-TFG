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
import { AlertTriangle, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HoraExtra } from "../../../types";

interface HoraExtraDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horaExtra: HoraExtra | null;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function HoraExtraDeleteDialog({
  open,
  onOpenChange,
  horaExtra,
  onConfirm,
  isDeleting = false,
}: HoraExtraDeleteDialogProps) {
  if (!horaExtra) return null;

  const handleDelete = async () => {
    await onConfirm(horaExtra.idHoraExtra);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle className="text-red-600">
              Eliminar Solicitud de Horas Extra
            </DialogTitle>
          </div>
          <DialogDescription className="space-y-4 pt-4">
            <p>
              ¿Estás seguro de que deseas eliminar esta solicitud de horas
              extra?
            </p>

            {/* Información de la solicitud */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{horaExtra.nombreEmpleado}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {format(new Date(horaExtra.fechaInicio), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}{" "}
                  -{" "}
                  {format(new Date(horaExtra.fechaFin), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {Math.floor(horaExtra.horasTotales / 60)}h{" "}
                  {horaExtra.horasTotales % 60}m
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Estado:</span>
                <Badge variant="outline">{horaExtra.estadoSolicitud}</Badge>
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
