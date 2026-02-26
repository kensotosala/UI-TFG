"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Permiso } from "@/app/features/permisos/types";

interface PermisoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permiso: Permiso | null;
}

const ESTADO_COLORS = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  APROBADA: "bg-green-100 text-green-800",
  RECHAZADA: "bg-red-100 text-red-800",
};

export const PermisoDetailsDialog = ({
  open,
  onOpenChange,
  permiso,
}: PermisoDetailsDialogProps) => {
  if (!permiso) return null;

  const estado = permiso.estadoSolicitud || "PENDIENTE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Permiso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fecha del Permiso
              </p>
              <p className="text-base font-semibold">
                {format(new Date(permiso.fechaPermiso), "dd/MM/yyyy", {
                  locale: es,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Solicitud
              </p>
              <p className="text-base">
                {format(new Date(permiso.fechaSolicitud), "dd/MM/yyyy", {
                  locale: es,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estado
              </p>
              <Badge
                className={ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS]}
                variant="secondary"
              >
                {estado}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Goce de Salario
              </p>
              <p className="text-base">
                {permiso.conGoceSalario ? "Sí" : "No"}
              </p>
            </div>

            {permiso.fechaAprobacion && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha de Aprobación
                </p>
                <p className="text-base">
                  {format(new Date(permiso.fechaAprobacion), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
            )}

            {permiso.jefeApruebaId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aprobado por (ID)
                </p>
                <p className="text-base">{permiso.jefeApruebaId}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Motivo
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{permiso.motivo}</p>
            </div>
          </div>

          {permiso.comentariosRechazo && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Comentarios de Rechazo
              </p>
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-900 whitespace-pre-wrap">
                  {permiso.comentariosRechazo}
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>ID del Permiso: {permiso.idPermiso}</p>
            {permiso.fechaCreacion && (
              <p>
                Creado:{" "}
                {format(new Date(permiso.fechaCreacion), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
