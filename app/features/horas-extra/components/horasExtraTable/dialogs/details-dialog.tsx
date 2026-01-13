"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HoraExtra, EstadoSolicitud } from "../../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Timer,
} from "lucide-react";

interface HoraExtraDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horaExtra: HoraExtra | null;
}

/**
 * Configuración del badge según estado
 */
const getEstadoBadge = (estado: EstadoSolicitud) => {
  const badges: Record<
    EstadoSolicitud,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoSolicitud.PENDIENTE]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800",
    },
    [EstadoSolicitud.APROBADA]: {
      variant: "default",
      className: "bg-green-100 text-green-800",
    },
    [EstadoSolicitud.RECHAZADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800",
    },
  };

  return badges[estado];
};

/**
 * Formatear minutos a horas y minutos
 */
const formatearMinutos = (minutos: number): string => {
  if (!minutos) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

export function HoraExtraDetailsDialog({
  open,
  onOpenChange,
  horaExtra,
}: HoraExtraDetailsDialogProps) {
  if (!horaExtra) return null;

  const badgeConfig = getEstadoBadge(horaExtra.estadoSolicitud);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de Solicitud de Horas Extra</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Empleado */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4" />
              <span>Información del Empleado</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nombre Completo</p>
                <p className="text-sm font-medium">
                  {horaExtra.nombreEmpleado}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Código</p>
                <p className="text-sm font-medium">
                  {horaExtra.codigoEmpleado}
                </p>
              </div>
            </div>
          </section>

          {/* Información de la Solicitud */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="h-4 w-4" />
              <span>Información de la Solicitud</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Fecha de Solicitud
                </p>
                <p className="text-sm font-medium">
                  {format(
                    new Date(horaExtra.fechaSolicitud),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: es }
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  {horaExtra.estadoSolicitud}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Fecha de Inicio</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">
                    {format(
                      new Date(horaExtra.fechaInicio),
                      "dd/MM/yyyy HH:mm",
                      { locale: es }
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Fecha de Fin</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">
                    {format(new Date(horaExtra.fechaFin), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Horas Totales</p>
                <div className="flex items-center gap-2 text-blue-600">
                  <Timer className="h-4 w-4" />
                  <p className="font-medium">
                    {formatearMinutos(horaExtra.horasTotales)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <Badge variant="outline">{horaExtra.tipoHoraExtra}</Badge>
              </div>
            </div>
          </section>

          {/* Motivo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4" />
              <span>Motivo</span>
            </div>
            <Separator />
            <p className="text-sm bg-gray-50 p-3 rounded-md">
              {horaExtra.motivo}
            </p>
          </section>

          {/* Información de Aprobación */}
          {(horaExtra.nombreJefe || horaExtra.fechaAprobacion) && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle className="h-4 w-4" />
                <span>Información de Aprobación</span>
              </div>
              <Separator />
              <div className="bg-blue-50 p-4 rounded-md space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {horaExtra.nombreJefe && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Aprobado por
                      </p>
                      <p className="text-sm font-medium">
                        {horaExtra.nombreJefe}
                      </p>
                    </div>
                  )}

                  {horaExtra.fechaAprobacion && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Fecha de Aprobación
                      </p>
                      <p className="text-sm">
                        {format(
                          new Date(horaExtra.fechaAprobacion),
                          "dd/MM/yyyy",
                          { locale: es }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
