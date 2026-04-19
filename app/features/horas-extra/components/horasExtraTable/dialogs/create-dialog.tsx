/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CrearHoraExtraDTO, TipoHoraExtra } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useUsuariosAdmin } from "@/app/features/empleados/hooks/useUsuarios";

interface HoraExtraCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CrearHoraExtraDTO) => Promise<void>;
}

type FormErrors = Partial<Record<keyof CrearHoraExtraDTO, string>>;

const initialFormData: CrearHoraExtraDTO = {
  empleadoId: 0,
  fechaInicio: "",
  fechaFin: "",
  tipoHoraExtra: TipoHoraExtra.PENDIENTE,
  motivo: "",
  jefeApruebaId: undefined,
};

export function HoraExtraCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: HoraExtraCreateDialogProps) {
  const [formData, setFormData] = useState<CrearHoraExtraDTO>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { empleadosSinHorasExtraEnProceso } = useEmpleados();
  const { usuariosAdmin } = useUsuariosAdmin();

  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.empleadoId || formData.empleadoId === 0) {
      newErrors.empleadoId = "Debes seleccionar un empleado";
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es obligatoria";
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es obligatoria";
    }

    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);

      if (fin <= inicio) {
        newErrors.fechaFin =
          "La fecha de fin debe ser posterior a la de inicio";
      }

      const limiteMaximo = new Date();
      limiteMaximo.setMonth(limiteMaximo.getMonth() + 3);

      if (inicio > limiteMaximo) {
        newErrors.fechaInicio = "Máximo 3 meses de anticipación";
      }
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = "El motivo es obligatorio";
    }

    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);

      const horaInicio = inicio.getHours();
      const horaFin = fin.getHours();

      const HORA_FIN_JORNADA = 17;
      const MAX_HORAS_EXTRA = 4;
      const HORA_MAXIMA_PERMITIDA = 21;

      if (horaInicio < HORA_FIN_JORNADA) {
        newErrors.fechaInicio =
          "Las horas extra deben iniciar después de las 5:00 pm";
      }

      if (horaFin > HORA_MAXIMA_PERMITIDA) {
        newErrors.fechaFin = "Las horas extra no pueden superar las 9:00 pm";
      }

      const diffMs = fin.getTime() - inicio.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);

      if (diffHoras > MAX_HORAS_EXTRA) {
        newErrors.fechaFin =
          "No se pueden solicitar más de 4 horas extra por día";
      }

      if (fin <= inicio) {
        newErrors.fechaFin =
          "La fecha de fin debe ser posterior a la de inicio";
      }
    }

    const ahora = new Date();

    if (formData.fechaInicio) {
      const inicio = new Date(formData.fechaInicio);

      if (inicio < ahora) {
        newErrors.fechaInicio =
          "No puedes seleccionar una fecha u hora en el pasado";
      }
    }

    if (formData.fechaFin) {
      const fin = new Date(formData.fechaFin);

      if (fin < ahora) {
        newErrors.fechaFin =
          "No puedes seleccionar una fecha u hora en el pasado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof CrearHoraExtraDTO>(
    field: K,
    value: CrearHoraExtraDTO[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: CrearHoraExtraDTO = {
        empleadoId: formData.empleadoId,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        motivo: formData.motivo,
        jefeApruebaId: formData.jefeApruebaId,
        tipoHoraExtra: formData.tipoHoraExtra,
      };

      await onCreate(payload);
      handleClose();
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message || error.message || "Error desconocido";
      alert(`No se pudo crear: ${mensaje}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-2">
            Nueva Solicitud de Horas Extra
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Empleado */}
          <div className="space-y-2">
            <Label>Empleado *</Label>
            <Select
              value={formData.empleadoId?.toString() || ""}
              onValueChange={(val) => handleChange("empleadoId", parseInt(val))}
            >
              <SelectTrigger
                className={errors.empleadoId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Selecciona un empleado" />
              </SelectTrigger>
              <SelectContent>
                {empleadosSinHorasExtraEnProceso.map((e) => (
                  <SelectItem
                    key={e.idEmpleado}
                    value={e.idEmpleado.toString()}
                  >
                    {e.nombre} {e.primerApellido} {e.segundoApellido || ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.empleadoId && (
              <p className="text-xs text-destructive">{errors.empleadoId}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Inicio *</Label>
              <Input
                id="fechaInicio"
                type="datetime-local"
                min={getLocalDateTime()}
                className={errors.fechaInicio ? "border-destructive" : ""}
                value={formData.fechaInicio}
                onChange={(e) => handleChange("fechaInicio", e.target.value)}
              />
              {errors.fechaInicio && (
                <p className="text-xs text-destructive">{errors.fechaInicio}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fin *</Label>
              <Input
                id="fechaFin"
                type="datetime-local"
                min={getLocalDateTime()}
                className={errors.fechaFin ? "border-destructive" : ""}
                value={formData.fechaFin}
                onChange={(e) => handleChange("fechaFin", e.target.value)}
              />
              {errors.fechaFin && (
                <p className="text-xs text-destructive">{errors.fechaFin}</p>
              )}
            </div>
          </div>

          {/* Tipo
          <div className="space-y-2">
            <Label>Tipo de Hora Extra (Referencia)</Label>
            <Select
              value={formData.tipoHoraExtra}
              onValueChange={(val) =>
                handleChange("tipoHoraExtra", val as TipoHoraExtra)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TipoHoraExtra).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Este campo es solo informativo y no afecta el registro
            </p>
          </div> */}

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo *</Label>
            <Textarea
              id="motivo"
              className={errors.motivo ? "border-destructive" : ""}
              value={formData.motivo}
              onChange={(e) => handleChange("motivo", e.target.value)}
              placeholder="Describa el motivo..."
            />
            {errors.motivo && (
              <p className="text-xs text-destructive">{errors.motivo}</p>
            )}
          </div>

          {/* Jefe (Opcional)
          <div className="space-y-2">
            <Label>Jefe que Aprueba (Opcional)</Label>

            <Select
              value={formData.jefeApruebaId?.toString() || ""}
              onValueChange={(val) =>
                handleChange("jefeApruebaId", val ? parseInt(val) : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un jefe" />
              </SelectTrigger>

              <SelectContent>
                {usuariosAdmin
                  .filter((u) => u.empleadoId !== formData.empleadoId)
                  .map((u) => (
                    <SelectItem
                      key={u.idUsuario}
                      value={u.idUsuario.toString()}
                    >
                      {u.nombreEmpleado}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Solicitud"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
