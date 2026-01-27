import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IncapacidadDetailsDialogProps,
  ESTADOS_INCAPACIDAD,
  TIPOS_INCAPACIDAD,
} from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { ExternalLink } from "lucide-react";

export function IncapacidadDetailsDialog({
  open,
  onOpenChange,
  incapacidad,
}: IncapacidadDetailsDialogProps) {
  const { empleados } = useEmpleados();

  if (!incapacidad) return null;

  const empleado = empleados.find(
    (e) => e.idEmpleado === incapacidad.empleadoId,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      [TIPOS_INCAPACIDAD.ENFERMEDAD]: "Enfermedad",
      [TIPOS_INCAPACIDAD.ACCIDENTE]: "Accidente",
      [TIPOS_INCAPACIDAD.MATERNIDAD]: "Maternidad",
      [TIPOS_INCAPACIDAD.PATERNIDAD]: "Paternidad",
    };
    return labels[tipo] || tipo;
  };

  const getEstadoBadgeVariant = (estado: string) => {
    return estado === ESTADOS_INCAPACIDAD.ACTIVA ? "default" : "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles de Incapacidad</DialogTitle>
          <Separator />
        </DialogHeader>

        <div className="space-y-4">
          {/* Empleado */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Empleado
            </p>
            <p className="text-base">
              {empleado
                ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido || ""}`
                : "No encontrado"}
            </p>
          </div>

          {/* Estado */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Estado
            </p>
            <Badge variant={getEstadoBadgeVariant(incapacidad.estado)}>
              {incapacidad.estado}
            </Badge>
          </div>

          {/* Tipo */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tipo de Incapacidad
            </p>
            <p className="text-base">
              {getTipoLabel(incapacidad.tipoIncapacidad)}
            </p>
          </div>

          {/* Diagnóstico */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Diagnóstico
            </p>
            <p className="text-base whitespace-pre-wrap">
              {incapacidad.diagnostico}
            </p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Inicio
              </p>
              <p className="text-base">{formatDate(incapacidad.fechaInicio)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Fin
              </p>
              <p className="text-base">{formatDate(incapacidad.fechaFin)}</p>
            </div>
          </div>

          {/* Archivo Adjunto */}
          {incapacidad.archivoAdjunto && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Archivo Adjunto
              </p>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={incapacidad.archivoAdjunto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver documento
                </a>
              </Button>
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
