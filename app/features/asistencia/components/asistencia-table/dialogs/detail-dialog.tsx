/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  FileText,
  CheckCircle,
  Timer,
} from "lucide-react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AsistenciaDetallada, EstadoAsistencia } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useDepartamentos } from "@/app/features/departamentos/hooks/useDepartamentos";
import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";

interface AsistenciaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistencia: AsistenciaDetallada | null;
}

/**
 * Configuración del badge según estado
 */
const getEstadoBadge = (estado: EstadoAsistencia) => {
  const badges: Record<
    EstadoAsistencia,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoAsistencia.PRESENTE]: {
      variant: "default",
      className: "bg-green-100 text-green-800",
    },
    [EstadoAsistencia.AUSENTE]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800",
    },
    [EstadoAsistencia.TARDANZA]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800",
    },
    [EstadoAsistencia.JUSTIFICADO]: {
      variant: "outline",
      className: "bg-blue-100 text-blue-800",
    },
    [EstadoAsistencia.PERMISO]: {
      variant: "outline",
      className: "bg-purple-100 text-purple-800",
    },
    [EstadoAsistencia.VACACIONES]: {
      variant: "outline",
      className: "bg-cyan-100 text-cyan-800",
    },
    [EstadoAsistencia.LICENCIA_MEDICA]: {
      variant: "outline",
      className: "bg-orange-100 text-orange-800",
    },
  };

  return badges[estado];
};

/**
 * Formatear minutos a horas y minutos
 */
const formatearMinutos = (minutos?: number): string => {
  if (minutos == null) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

export function AsistenciaDetailsDialog({
  open,
  onOpenChange,
  asistencia,
}: AsistenciaDetailsDialogProps) {
  const { empleados } = useEmpleados();
  const { departamentos } = useDepartamentos();
  const { puestos } = usePuestos();

  const empleadoSeleccionado = empleados.find(
    (emp) => emp.idEmpleado === Number(asistencia?.empleadoId),
  );

  const departamentoEmpleado = departamentos.find(
    (dept: any) => dept.idDepartamento === empleadoSeleccionado?.departamentoId,
  );

  const puestoEmpleado = puestos.find(
    (puesto: any) => puesto.idPuesto === empleadoSeleccionado?.puestoId,
  );

  if (!asistencia) return null;

  const badgeConfig = getEstadoBadge(asistencia.estado);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de Asistencia</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Empleado */}
          <section className="space-y-3">
            <Header icon={User} title="Información del Empleado" />
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <Info
                label="Nombre Completo"
                value={empleadoSeleccionado?.nombreUsuario ?? "-"}
              />
              <Info label="Email" value={empleadoSeleccionado?.email} />
              <Info
                label="Departamento"
                value={departamentoEmpleado?.nombreDepartamento ?? "-"}
              />
              <Info label="Cargo" value={puestoEmpleado?.nombrePuesto ?? "-"} />
            </div>
          </section>

          {/* Información de Asistencia */}
          <section className="space-y-3">
            <Header icon={Calendar} title="Información de Asistencia" />
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <Info
                label="Fecha"
                value={format(new Date(asistencia.fecha), "dd/MM/yyyy", {
                  locale: es,
                })}
              />

              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  {asistencia.estado}
                </Badge>
              </div>

              <Hora
                label="Hora de Entrada"
                value={asistencia.horaEntrada ?? undefined}
              />
              <Hora
                label="Hora de Salida"
                value={asistencia.horaSalida ?? undefined}
              />

              <Tiempo
                label="Horas Trabajadas"
                minutos={asistencia.horasTrabajadas}
                color="blue"
              />

              {asistencia.tiempoExtra! > 0 && (
                <Tiempo
                  label="Tiempo Extra"
                  minutos={asistencia.tiempoExtra}
                  color="orange"
                />
              )}
            </div>
          </section>

          {/* Observaciones */}
          {asistencia.observaciones && (
            <section className="space-y-3">
              <Header icon={FileText} title="Observaciones" />
              <Separator />
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {asistencia.observaciones}
              </p>
            </section>
          )}

          {/* Justificación */}
          {asistencia.justificacion && (
            <section className="space-y-3">
              <Header icon={Briefcase} title="Justificación" />
              <Separator />
              <div className="bg-blue-50 p-4 rounded-md space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <Badge variant="outline">
                      {asistencia.justificacion.tipo}
                    </Badge>
                  </div>

                  {asistencia.justificacion.aprobadoPor && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Aprobada</span>
                    </div>
                  )}
                </div>

                <Info
                  label="Descripción"
                  value={asistencia.justificacion.descripcion}
                />

                {asistencia.justificacion.documentoUrl && (
                  <a
                    href={asistencia.justificacion.documentoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver documento →
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------- Subcomponentes simples ----------------- */

const Header = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
    <Icon className="h-4 w-4" />
    <span>{title}</span>
  </div>
);

const Info = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value ?? "-"}</p>
  </div>
);

const Hora = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-gray-500" />
      <p className="font-mono">
        {value ? format(new Date(`2000-01-01T${value}`), "HH:mm") : "-"}
      </p>
    </div>
  </div>
);

const Tiempo = ({
  label,
  minutos,
  color,
}: {
  label: string;
  minutos?: number;
  color: "blue" | "orange";
}) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className={`flex items-center gap-2 text-${color}-600`}>
      <Timer className="h-4 w-4" />
      <p className="font-medium">{formatearMinutos(minutos)}</p>
    </div>
  </div>
);
