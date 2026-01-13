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
  ActualizarHoraExtraDTO,
  HoraExtra,
  TipoHoraExtra,
} from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { format } from "date-fns";

interface HoraExtraEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: number, data: ActualizarHoraExtraDTO) => Promise<void>;
  horaExtra: HoraExtra | null;
}

export function HoraExtraEditDialog({
  open,
  onOpenChange,
  onUpdate,
  horaExtra,
}: HoraExtraEditDialogProps) {
  const [formData, setFormData] = useState<ActualizarHoraExtraDTO>({
    empleadoId: 0,
    fechaInicio: "",
    fechaFin: "",
    tipoHoraExtra: TipoHoraExtra.ORDINARIA,
    motivo: "",
    jefeApruebaId: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { empleados } = useEmpleados();

  // ✅ Cargar datos cuando cambie horaExtra o se abra el diálogo
  useEffect(() => {
    if (horaExtra && open) {
      // Convertir las fechas ISO a formato datetime-local
      const fechaInicio = horaExtra.fechaInicio
        ? format(new Date(horaExtra.fechaInicio), "yyyy-MM-dd'T'HH:mm")
        : "";
      const fechaFin = horaExtra.fechaFin
        ? format(new Date(horaExtra.fechaFin), "yyyy-MM-dd'T'HH:mm")
        : "";

      setFormData({
        empleadoId: horaExtra.empleadoId,
        fechaInicio,
        fechaFin,
        tipoHoraExtra: horaExtra.tipoHoraExtra,
        motivo: horaExtra.motivo,
        jefeApruebaId: horaExtra.jefeApruebaId ?? undefined,
      });
    }
  }, [horaExtra, open]);

  const handleChange = <K extends keyof ActualizarHoraExtraDTO>(
    field: K,
    value: ActualizarHoraExtraDTO[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!horaExtra) {
      alert("No hay hora extra seleccionada");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!formData.fechaInicio || !formData.fechaFin) {
        alert("Por favor ingrese las fechas de inicio y fin");
        return;
      }

      if (!formData.motivo.trim()) {
        alert("Por favor ingrese el motivo");
        return;
      }

      console.log("📝 Datos de actualización:", formData);

      await onUpdate(horaExtra.idHoraExtra, formData);
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!horaExtra) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-2">
            Editar Solicitud de Horas Extra
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Información de solo lectura */}
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Empleado:</span>
                  <p className="text-muted-foreground">
                    {horaExtra.nombreEmpleado}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Estado:</span>
                  <p className="text-muted-foreground">
                    {horaExtra.estadoSolicitud}
                  </p>
                </div>
              </div>
            </div>

            {/* Empleado (editable) */}
            <div>
              <Label htmlFor="empleado" className="mb-2">
                Empleado *
              </Label>
              <Select
                value={formData.empleadoId?.toString() || ""}
                onValueChange={(value) =>
                  handleChange("empleadoId", parseInt(value))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Empleados</SelectLabel>
                    {empleados.map((empleado) => (
                      <SelectItem
                        key={empleado.idEmpleado}
                        value={empleado.idEmpleado.toString()}
                      >
                        {empleado.nombre} {empleado.primerApellido}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaInicio" className="mb-2">
                  Fecha y Hora de Inicio *
                </Label>
                <Input
                  id="fechaInicio"
                  type="datetime-local"
                  value={formData.fechaInicio}
                  onChange={(e) => handleChange("fechaInicio", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fechaFin" className="mb-2">
                  Fecha y Hora de Fin *
                </Label>
                <Input
                  id="fechaFin"
                  type="datetime-local"
                  value={formData.fechaFin}
                  onChange={(e) => handleChange("fechaFin", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <Label htmlFor="tipoHoraExtra" className="mb-2">
                Tipo de Hora Extra
              </Label>
              <Select
                value={formData.tipoHoraExtra}
                onValueChange={(value) =>
                  handleChange("tipoHoraExtra", value as TipoHoraExtra)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    {Object.values(TipoHoraExtra).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Motivo */}
            <div>
              <Label htmlFor="motivo" className="mb-2">
                Motivo *
              </Label>
              <Textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => handleChange("motivo", e.target.value)}
                placeholder="Describe el motivo de las horas extra..."
                rows={3}
                required
              />
            </div>

            {/* Jefe que Aprueba */}
            <div>
              <Label htmlFor="jefeAprueba" className="mb-2">
                Jefe que Aprueba (Opcional)
              </Label>
              <Select
                value={formData.jefeApruebaId?.toString() || ""}
                onValueChange={(value) =>
                  handleChange(
                    "jefeApruebaId",
                    value ? parseInt(value) : undefined
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un jefe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jefes</SelectLabel>
                    {empleados
                      .filter((e) => e.idEmpleado !== formData.empleadoId)
                      .map((empleado) => (
                        <SelectItem
                          key={empleado.idEmpleado}
                          value={empleado.idEmpleado.toString()}
                        >
                          {empleado.nombre} {empleado.primerApellido}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar Solicitud"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
