"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

      {/* Hora actual como referencia */}
      {current && (
        <p className="text-xs text-muted-foreground mt-1">Actual: {current}</p>
      )}
    </div>
  );
}

export function AsistenciaEditDialog({
  open,
  onOpenChange,
  onUpdate,
  asistencia,
}: AsistenciaEditDialogProps) {
  const [estado, setEstado] = useState<EstadoAsistencia>(
    EstadoAsistencia.PRESENTE,
  );
  const [observaciones, setObservaciones] = useState("");
  const [horaEntrada, setHoraEntrada] = useState<TimeValue>(emptyTime);
  const [horaSalida, setHoraSalida] = useState<TimeValue>(emptyTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos existentes al abrir
  useEffect(() => {
    if (asistencia && open) {
      setEstado(asistencia.estado);
      setObservaciones(asistencia.observaciones || "");
      setHoraEntrada(from24Hour(asistencia.horaEntrada || ""));
      setHoraSalida(from24Hour(asistencia.horaSalida || ""));
    }
  }, [asistencia, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asistencia) return;

    setIsSubmitting(true);
    try {
      const payload: ActualizarAsistenciaDTO = { estado };

      const entrada = to24Hour(horaEntrada);
      const salida = to24Hour(horaSalida);

      if (entrada) payload.horaEntrada = entrada;
      if (salida) payload.horaSalida = salida;
      if (observaciones.trim()) payload.observaciones = observaciones.trim();

      await onUpdate(asistencia.id, payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEstado(EstadoAsistencia.PRESENTE);
    setObservaciones("");
    setHoraEntrada(emptyTime);
    setHoraSalida(emptyTime);
    onOpenChange(false);
  };

  if (!asistencia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Editar Asistencia</DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info solo lectura */}
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
            <TimeInput
              label="Hora de Entrada"
              value={horaEntrada}
              onChange={setHoraEntrada}
              current={asistencia.horaEntrada ?? undefined}
            />
            <TimeInput
              label="Hora de Salida"
              value={horaSalida}
              onChange={setHoraSalida}
              current={asistencia.horaSalida ?? undefined}
            />
          </div>

          {/* Estado */}
          <div>
            <Label className="mb-2">Estado *</Label>
            <Select
              value={estado}
              onValueChange={(value) => setEstado(value as EstadoAsistencia)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {Object.values(EstadoAsistencia).map((e) => (
                    <SelectItem key={e} value={e}>
                      {e.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Observaciones */}
          <div>
            <Label className="mb-2">Observaciones</Label>
            <Textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Agregar comentarios adicionales..."
              rows={3}
            />
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
              {isSubmitting ? "Actualizando..." : "Actualizar Asistencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
