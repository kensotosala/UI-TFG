/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Clock } from "lucide-react";
import { CrearHoraExtraDTO, TipoHoraExtra } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

interface HoraExtraCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CrearHoraExtraDTO) => Promise<void>;
}

// ──────────────────────────────────────────────────────────
// Tipos y helpers para hora en formato 12h
// ──────────────────────────────────────────────────────────
interface TimeValue {
  hours: string;
  minutes: string;
  period: "AM" | "PM";
}

const emptyTime: TimeValue = { hours: "", minutes: "", period: "AM" };

// Convierte "HH:mm" (24h) a TimeValue (12h)
function from24Hour(time24: string): TimeValue {
  if (!time24) return emptyTime;
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hours: String(h), minutes: mStr ?? "00", period };
}

// Convierte TimeValue a "HH:mm" (24h) para el backend
function to24Hour(time: TimeValue): string {
  if (!time.hours || !time.minutes) return "";
  let h = parseInt(time.hours, 10);
  if (time.period === "AM" && h === 12) h = 0;
  if (time.period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${time.minutes.padStart(2, "0")}`;
}

// Formatea una hora en string "HH:mm" a formato 12h para mostrar
function formatTime12(time24?: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${period}`;
}

// Componente de entrada de hora (12h)
function TimeInput({
  label,
  value,
  onChange,
  current,
}: {
  label: string;
  value: TimeValue;
  onChange: (val: TimeValue) => void;
  current?: string;
}) {
  return (
    <div>
      <Label className="mb-2">{label}</Label>
      <div className="flex items-center gap-1 border rounded-md px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />

        <input
          type="number"
          min={1}
          max={12}
          placeholder="HH"
          value={value.hours}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
              onChange({ ...value, hours: val });
            }
          }}
          className="w-8 text-center bg-transparent outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <span className="text-muted-foreground">:</span>

        <input
          type="number"
          min={0}
          max={59}
          placeholder="MM"
          value={value.minutes}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
              onChange({ ...value, minutes: val });
            }
          }}
          className="w-8 text-center bg-transparent outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <div className="ml-1 flex rounded overflow-hidden border text-xs font-medium">
          <button
            type="button"
            onClick={() => onChange({ ...value, period: "AM" })}
            className={`px-2 py-0.5 transition-colors ${
              value.period === "AM"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, period: "PM" })}
            className={`px-2 py-0.5 transition-colors ${
              value.period === "PM"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            PM
          </button>
        </div>
      </div>
      {current && (
        <p className="text-xs text-muted-foreground mt-1">Actual: {current}</p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────
export function HoraExtraCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: HoraExtraCreateDialogProps) {
  const { empleadosSinHorasExtraEnProceso } = useEmpleados();

  // Estados separados para fecha (YYYY-MM-DD) y hora (TimeValue)
  const [fechaInicioDate, setFechaInicioDate] = useState("");
  const [horaInicio, setHoraInicio] = useState<TimeValue>(emptyTime);
  const [fechaFinDate, setFechaFinDate] = useState("");
  const [horaFin, setHoraFin] = useState<TimeValue>(emptyTime);

  const [empleadoId, setEmpleadoId] = useState<number>(0);
  const [motivo, setMotivo] = useState("");
  const [errors, setErrors] = useState<{
    empleadoId?: string;
    fechaInicio?: string;
    fechaFin?: string;
    motivo?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencia de hora actual (formato 12h)
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    if (open) {
      // Mostrar la fecha/hora actual como referencia
      const now = new Date();
      const dateStr = now.toLocaleDateString("es-CR");
      const timeStr = formatTime12(`${now.getHours()}:${now.getMinutes()}`);
      setCurrentDateTime(`${dateStr} ${timeStr}`);
    }
  }, [open]);

  // Función para construir el datetime ISO a partir de fecha + hora 12h
  const buildDateTime = (dateStr: string, time: TimeValue): string | null => {
    if (!dateStr || !time.hours || !time.minutes) return null;
    const time24 = to24Hour(time);
    if (!time24) return null;
    return `${dateStr}T${time24}:00`;
  };

  // Obtener fecha/hora inicio como Date object (para validaciones)
  const getInicioDate = (): Date | null => {
    const iso = buildDateTime(fechaInicioDate, horaInicio);
    return iso ? new Date(iso) : null;
  };

  const getFinDate = (): Date | null => {
    const iso = buildDateTime(fechaFinDate, horaFin);
    return iso ? new Date(iso) : null;
  };

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Empleado
    if (!empleadoId || empleadoId === 0) {
      newErrors.empleadoId = "Debes seleccionar un empleado";
    }

    // Motivo
    if (!motivo.trim()) {
      newErrors.motivo = "El motivo es obligatorio";
    } else if (motivo.length < 5) {
      newErrors.motivo = "El motivo debe tener al menos 5 caracteres";
    }

    // Fechas y horas
    if (!fechaInicioDate || !horaInicio.hours || !horaInicio.minutes) {
      newErrors.fechaInicio = "Debes seleccionar fecha y hora de inicio";
    }
    if (!fechaFinDate || !horaFin.hours || !horaFin.minutes) {
      newErrors.fechaFin = "Debes seleccionar fecha y hora de fin";
    }

    const inicio = getInicioDate();
    const fin = getFinDate();
    const ahora = new Date();

    if (inicio && fin) {
      // Validar fechas pasadas
      if (inicio < ahora) {
        newErrors.fechaInicio =
          "No puedes seleccionar una fecha u hora en el pasado";
      }
      if (fin < ahora) {
        newErrors.fechaFin =
          "No puedes seleccionar una fecha u hora en el pasado";
      }

      // Fin posterior a inicio
      if (fin <= inicio) {
        newErrors.fechaFin =
          "La fecha y hora de fin deben ser posteriores al inicio";
      }

      // Máximo 3 meses de anticipación
      const limiteMaximo = new Date();
      limiteMaximo.setMonth(limiteMaximo.getMonth() + 3);
      if (inicio > limiteMaximo) {
        newErrors.fechaInicio = "Máximo 3 meses de anticipación";
      }

      // Validaciones específicas para horas extra (solo si es el mismo día)
      const mismaFecha = inicio.toDateString() === fin.toDateString();
      if (mismaFecha) {
        const horaInicioNum = inicio.getHours();
        const horaFinNum = fin.getHours();
        const HORA_FIN_JORNADA = 17; // 5:00 PM
        const HORA_MAXIMA_PERMITIDA = 21; // 9:00 PM
        const MAX_HORAS_EXTRA = 4;

        if (horaInicioNum < HORA_FIN_JORNADA) {
          newErrors.fechaInicio =
            "Las horas extra deben iniciar después de las 5:00 pm";
        }
        if (horaFinNum > HORA_MAXIMA_PERMITIDA) {
          newErrors.fechaFin =
            "Las horas extra no pueden terminar después de las 9:00 pm";
        }
        const diffHoras = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
        if (diffHoras > MAX_HORAS_EXTRA) {
          newErrors.fechaFin = `No se pueden solicitar más de ${MAX_HORAS_EXTRA} horas extra por día`;
        }
      } else {
        // Si son días distintos, limitamos a un máximo de 1 día
        const diffDias = Math.ceil(
          (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDias > 1) {
          newErrors.fechaFin =
            "La solicitud de horas extra no debe abarcar más de un día";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Limpiar errores al modificar un campo
  const clearFieldError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const inicioISO = buildDateTime(fechaInicioDate, horaInicio);
    const finISO = buildDateTime(fechaFinDate, horaFin);
    if (!inicioISO || !finISO) return;

    const payload: CrearHoraExtraDTO = {
      empleadoId,
      fechaInicio: inicioISO,
      fechaFin: finISO,
      motivo,
      tipoHoraExtra: TipoHoraExtra.PENDIENTE,
      jefeApruebaId: undefined, // opcional
    };

    setIsSubmitting(true);
    try {
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
    setEmpleadoId(0);
    setFechaInicioDate("");
    setHoraInicio(emptyTime);
    setFechaFinDate("");
    setHoraFin(emptyTime);
    setMotivo("");
    setErrors({});
    onOpenChange(false);
  };

  // Obtener fecha mínima para los inputs de tipo date (hoy)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-2">
            Nueva Solicitud de Horas Extra
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Referencia de fecha/hora actual */}
          <div className="bg-muted p-3 rounded-md flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fecha y hora actual:</span>
            <span className="font-medium">{currentDateTime || "..."}</span>
          </div>

          {/* Empleado */}
          <div className="space-y-2">
            <Label>Empleado *</Label>
            <Select
              value={empleadoId?.toString() || ""}
              onValueChange={(val) => {
                setEmpleadoId(parseInt(val));
                clearFieldError("empleadoId");
              }}
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

          {/* Fecha y hora de inicio */}
          <div className="space-y-2">
            <Label>Fecha de Inicio *</Label>
            <Input
              type="date"
              value={fechaInicioDate}
              min={today}
              onChange={(e) => {
                setFechaInicioDate(e.target.value);
                clearFieldError("fechaInicio");
              }}
              className={errors.fechaInicio ? "border-destructive" : ""}
            />
          </div>
          <TimeInput
            label="Hora de Inicio"
            value={horaInicio}
            onChange={(val) => {
              setHoraInicio(val);
              clearFieldError("fechaInicio");
            }}
          />

          {/* Fecha y hora de fin */}
          <div className="space-y-2">
            <Label>Fecha de Fin *</Label>
            <Input
              type="date"
              value={fechaFinDate}
              min={fechaInicioDate || today}
              onChange={(e) => {
                setFechaFinDate(e.target.value);
                clearFieldError("fechaFin");
              }}
              className={errors.fechaFin ? "border-destructive" : ""}
            />
          </div>
          <TimeInput
            label="Hora de Fin"
            value={horaFin}
            onChange={(val) => {
              setHoraFin(val);
              clearFieldError("fechaFin");
            }}
          />

          {errors.fechaInicio && (
            <p className="text-xs text-destructive -mt-2">
              {errors.fechaInicio}
            </p>
          )}
          {errors.fechaFin && (
            <p className="text-xs text-destructive -mt-2">{errors.fechaFin}</p>
          )}

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo *</Label>
            <Textarea
              id="motivo"
              className={errors.motivo ? "border-destructive" : ""}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                clearFieldError("motivo");
              }}
              placeholder="Describa el motivo de la solicitud..."
              rows={3}
            />
            {errors.motivo && (
              <p className="text-xs text-destructive">{errors.motivo}</p>
            )}
          </div>

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
