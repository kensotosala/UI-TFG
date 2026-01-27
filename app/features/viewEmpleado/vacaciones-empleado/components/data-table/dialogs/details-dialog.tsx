"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useSaldoVacacionesQuery } from "../../../queries/vacaciones.queries";
import { ListarVacacionesDTO } from "../../../vacaciones.types";

interface VacacionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacacion: ListarVacacionesDTO | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calcularDias = (fechaInicio: string, fechaFin: string): number => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - inicio.getTime();
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
  return dias > 0 ? dias : 0;
};

const getEstadoBadgeVariant = (
  estado: string | null,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (estado) {
    case "PENDIENTE":
      return "outline";
    case "APROBADA":
      return "default";
    case "RECHAZADA":
      return "destructive";
    case "CANCELADA":
      return "secondary";
    default:
      return "secondary";
  }
};

const getEstadoLabel = (estado: string | null): string => {
  const labels: Record<string, string> = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    RECHAZADA: "Rechazada",
    CANCELADA: "Cancelada",
  };
  return estado ? labels[estado] || estado : "Sin estado";
};

const getEstadoIcon = (estado: string | null) => {
  switch (estado) {
    case "PENDIENTE":
      return <Clock className="h-4 w-4" />;
    case "APROBADA":
      return <CheckCircle className="h-4 w-4" />;
    case "RECHAZADA":
      return <XCircle className="h-4 w-4" />;
    case "CANCELADA":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export function VacacionDetailsDialog({
  open,
  onOpenChange,
  vacacion,
}: VacacionDetailsDialogProps) {
  const { empleados } = useEmpleados();

  const { data: saldoData } = useSaldoVacacionesQuery(
    vacacion?.empleadoId || 0,
    new Date().getFullYear(),
    !!vacacion && open,
  );

  if (!vacacion) return null;

  const empleado = empleados.find((e) => e.idEmpleado === vacacion.empleadoId);
  const jefe = empleados.find((e) => e.idEmpleado === vacacion.jefeApruebaId);
  const diasVacaciones = calcularDias(vacacion.fechaInicio, vacacion.fechaFin);
  const saldo = saldoData?.datos;

  const getNombreCompleto = (
    nombre?: string,
    apellido1?: string,
    apellido2?: string | null,
  ) => {
    if (!nombre) return "No encontrado";
    return `${nombre} ${apellido1 || ""} ${apellido2 || ""}`.trim();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles de Solicitud de Vacaciones
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                ID de Solicitud
              </p>
              <p className="text-base font-semibold">#{vacacion.idVacacion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Estado
              </p>
              <Badge
                variant={getEstadoBadgeVariant(vacacion.estadoSolicitud)}
                className="flex items-center gap-1 w-fit"
              >
                {getEstadoIcon(vacacion.estadoSolicitud)}
                {getEstadoLabel(vacacion.estadoSolicitud)}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Empleado
              </p>
            </div>
            <p className="text-base">
              {getNombreCompleto(
                empleado?.nombre,
                empleado?.primerApellido,
                empleado?.segundoApellido,
              )}
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm font-medium mb-3">Período de Vacaciones</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Desde</p>
                <p className="text-base font-medium">
                  {formatDate(vacacion.fechaInicio)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hasta</p>
                <p className="text-base font-medium">
                  {formatDate(vacacion.fechaFin)}
                </p>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total de días:
              </span>
              <span className="text-2xl font-bold text-primary">
                {diasVacaciones} {diasVacaciones === 1 ? "día" : "días"}
              </span>
            </div>
          </div>

          {saldo && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">
                    Saldo actual del empleado ({saldo.anio}):
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Acumulados
                      </p>
                      <p className="font-semibold">{saldo.diasAcumulados}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Disfrutados
                      </p>
                      <p className="font-semibold">{saldo.diasDisfrutados}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Disponibles
                      </p>
                      <p className="font-semibold text-primary">
                        {saldo.diasDisponibles}
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Solicitud
              </p>
              <p className="text-base">
                {formatDateTime(vacacion.fechaSolicitud)}
              </p>
            </div>
            {vacacion.fechaAprobacion && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha de Aprobación
                </p>
                <p className="text-base">
                  {formatDateTime(vacacion.fechaAprobacion)}
                </p>
              </div>
            )}
          </div>

          {vacacion.jefeApruebaId && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {vacacion.estadoSolicitud === "APROBADA"
                  ? "Aprobado por"
                  : "Procesado por"}
              </p>
              <p className="text-base">
                {getNombreCompleto(
                  jefe?.nombre,
                  jefe?.primerApellido,
                  jefe?.segundoApellido,
                )}
              </p>
            </div>
          )}

          {vacacion.comentariosRechazo && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">Motivo de Rechazo:</p>
                <p className="text-sm whitespace-pre-wrap">
                  {vacacion.comentariosRechazo}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {vacacion.fechaCreacion && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Creado: {formatDateTime(vacacion.fechaCreacion)}</p>
              {vacacion.fechaModificacion && (
                <p>
                  Última modificación:{" "}
                  {formatDateTime(vacacion.fechaModificacion)}
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
