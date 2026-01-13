// components/asistencias/AsistenciaEditDialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ActualizarAsistenciaDTO,
  AsistenciaDetallada,
  EstadoAsistencia,
} from "../../../types";
import { Clock } from "lucide-react";

interface AsistenciaEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: ActualizarAsistenciaDTO) => Promise<void>;
  asistencia: AsistenciaDetallada | null;
}

export function AsistenciaEditDialog({
  open,
  onOpenChange,
  onUpdate,
  asistencia,
}: AsistenciaEditDialogProps) {
  const [formData, setFormData] = useState<ActualizarAsistenciaDTO>({
    horaEntrada: "",
    horaSalida: "",
    estado: EstadoAsistencia.PRESENTE,
    observaciones: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Cargar datos de la asistencia cuando cambie o se abra el diálogo
  useEffect(() => {
    if (asistencia && open) {
      console.log("📋 Cargando datos de asistencia:", asistencia);
      setFormData({
        horaEntrada: asistencia.horaEntrada || "",
        horaSalida: asistencia.horaSalida || "",
        estado: asistencia.estado,
        observaciones: asistencia.observaciones || "",
      });
    }
  }, [asistencia, open]);

  const handleChange = <K extends keyof ActualizarAsistenciaDTO>(
    field: K,
    value: ActualizarAsistenciaDTO[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!asistencia) {
      alert("No hay asistencia seleccionada");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ MEJORADO: Construir payload dinámicamente
      const payload: ActualizarAsistenciaDTO = {};

      // ✅ Siempre incluir estado (es requerido en el backend)
      payload.estado = formData.estado;

      // ✅ IMPORTANTE: Solo incluir horaEntrada si tiene valor
      // Si el campo está vacío, NO lo enviamos (el backend mantendrá el valor actual)
      if (formData.horaEntrada && formData.horaEntrada.trim() !== "") {
        payload.horaEntrada = formData.horaEntrada.trim();
      }

      // ✅ IMPORTANTE: Solo incluir horaSalida si tiene valor
      if (formData.horaSalida && formData.horaSalida.trim() !== "") {
        payload.horaSalida = formData.horaSalida.trim();
      }

      // ✅ Solo incluir observaciones si existen
      if (formData.observaciones && formData.observaciones.trim() !== "") {
        payload.observaciones = formData.observaciones.trim();
      }

      console.log("📝 Datos de actualización (FORM):", payload);

      await onUpdate(asistencia.id, payload);

      // ✅ Cerrar el diálogo después de actualizar exitosamente
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
      // El error ya se muestra en el toast desde el hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ No renderizar si no hay asistencia
  if (!asistencia) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Editar Asistencia</DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Información del Empleado (Solo lectura) */}
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Empleado:</span>
                  <p className="text-muted-foreground">
                    {asistencia.empleado.nombreCompleto}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Fecha:</span>
                  <p className="text-muted-foreground">{asistencia.fecha}</p>
                </div>
              </div>
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horaEntrada" className="mb-2">
                  Hora de Entrada
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="horaEntrada"
                    type="time"
                    step="1"
                    value={formData.horaEntrada || ""}
                    onChange={(e) =>
                      handleChange("horaEntrada", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
                {asistencia.horaEntrada && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Actual: {asistencia.horaEntrada}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="horaSalida" className="mb-2">
                  Hora de Salida
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="horaSalida"
                    type="time"
                    step="1"
                    value={formData.horaSalida || ""}
                    onChange={(e) => handleChange("horaSalida", e.target.value)}
                    className="pl-10"
                  />
                </div>
                {asistencia.horaSalida && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Actual: {asistencia.horaSalida}
                  </p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="estado" className="mb-2">
                Estado *
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(value) =>
                  handleChange("estado", value as EstadoAsistencia)
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    {Object.values(EstadoAsistencia).map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones" className="mb-2">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones || ""}
                onChange={(e) => handleChange("observaciones", e.target.value)}
                placeholder="Agregar comentarios adicionales..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Resetear formulario al cerrar
                setFormData({
                  horaEntrada: "",
                  horaSalida: "",
                  estado: EstadoAsistencia.PRESENTE,
                  observaciones: "",
                });
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar Asistencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
