/* eslint-disable react-hooks/set-state-in-effect */
// components/asistencias/AsistenciaEditDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  ActualizarAsistenciaDTO,
  AsistenciaDetallada,
  EstadoAsistencia,
} from "../../../types";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AsistenciaEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistencia: AsistenciaDetallada | null;
  onSave: (id: string, data: ActualizarAsistenciaDTO) => void;
  isLoading: boolean;
}

type FormErrors = {
  horaEntrada?: string;
  horaSalida?: string;
  estado?: string;
};

export function AsistenciaEditDialog({
  open,
  onOpenChange,
  asistencia,
  onSave,
  isLoading,
}: AsistenciaEditDialogProps) {
  const [form, setForm] = useState<ActualizarAsistenciaDTO>({});
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (asistencia) {
      setForm({
        horaEntrada: asistencia.horaEntrada || "",
        horaSalida: asistencia.horaSalida || "",
        estado: asistencia.estado,
        observaciones: asistencia.observaciones || "",
      });
      setErrors({});
    }
  }, [asistencia]);

  if (!asistencia) return null;

  const validate = (data: ActualizarAsistenciaDTO): FormErrors => {
    const newErrors: FormErrors = {};

    // Validar que la hora de salida sea posterior a la de entrada
    if (data.horaEntrada && data.horaSalida) {
      const entrada = new Date(`2000-01-01T${data.horaEntrada}`);
      const salida = new Date(`2000-01-01T${data.horaSalida}`);

      if (salida <= entrada) {
        newErrors.horaSalida =
          "La hora de salida debe ser posterior a la entrada";
      }
    }

    return newErrors;
  };

  const handleChange = <K extends keyof ActualizarAsistenciaDTO>(
    field: K,
    value: ActualizarAsistenciaDTO[K]
  ) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setErrors(validate(updated));
  };

  const handleSave = () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(asistencia.id, form);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Asistencia</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Información del Empleado (solo lectura) */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Empleado</p>
            <p className="font-medium">{asistencia.empleado.nombreCompleto}</p>
            <p className="text-xs text-gray-500">
              {asistencia.empleado.departamento}
            </p>
          </div>

          <Separator />

          {/* Horas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaEntrada">Hora de Entrada</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="horaEntrada"
                  type="time"
                  value={form.horaEntrada || ""}
                  onChange={(e) => handleChange("horaEntrada", e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.horaEntrada && (
                <p className="text-sm text-red-500">{errors.horaEntrada}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaSalida">Hora de Salida</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="horaSalida"
                  type="time"
                  value={form.horaSalida || ""}
                  onChange={(e) => handleChange("horaSalida", e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.horaSalida && (
                <p className="text-sm text-red-500">{errors.horaSalida}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(value) =>
                handleChange("estado", value as EstadoAsistencia)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {Object.values(EstadoAsistencia).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.estado && (
              <p className="text-sm text-red-500">{errors.estado}</p>
            )}
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={form.observaciones || ""}
              onChange={(e) => handleChange("observaciones", e.target.value)}
              placeholder="Agregar comentarios adicionales..."
              rows={3}
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={hasErrors || isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
