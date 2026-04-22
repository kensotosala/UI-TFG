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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, Clock } from "lucide-react";
import { CrearAsistenciaDTO, EstadoAsistencia } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

interface AsistenciaCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CrearAsistenciaDTO) => Promise<void>;
}

interface TimeValue {
  hours: string;
  minutes: string;
  period: "AM" | "PM";
}

const initialTimeValue: TimeValue = {
  hours: "",
  minutes: "",
  period: "AM",
};

const initialFormData: CrearAsistenciaDTO = {
  empleadoId: "",
  fechaRegistro: "",
  horaEntrada: "",
  horaSalida: "",
  estado: EstadoAsistencia.PRESENTE,
  observaciones: "",
};

// Convierte TimeValue a formato HH:mm (24h) para el backend
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
}: {
  label: string;
  value: TimeValue;
  onChange: (val: TimeValue) => void;
}) {
  return (
    <div>
      <Label className="mb-2">{label}</Label>
      <div className="flex items-center gap-1 border rounded-md px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />

        {/* Horas */}
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

        {/* Minutos */}
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

        {/* AM/PM toggle */}
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
    </div>
  );
}

export function AsistenciaCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: AsistenciaCreateDialogProps) {
  const [formData, setFormData] = useState<CrearAsistenciaDTO>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [horaEntrada, setHoraEntrada] = useState<TimeValue>(initialTimeValue);
  const [horaSalida, setHoraSalida] = useState<TimeValue>(initialTimeValue);

  const { empleados } = useEmpleados();

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleChange = <K extends keyof CrearAsistenciaDTO>(
    field: K,
    value: CrearAsistenciaDTO[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.empleadoId) {
        alert("Por favor seleccione un empleado");
        return;
      }
      if (!formData.fechaRegistro) {
        alert("Por favor seleccione una fecha");
        return;
      }
      if (!formData.estado) {
        alert("Por favor seleccione un estado");
        return;
      }

      const payload: CrearAsistenciaDTO = {
        empleadoId: formData.empleadoId,
        fechaRegistro: formData.fechaRegistro,
        estado: formData.estado,
      };

      const entrada = to24Hour(horaEntrada);
      const salida = to24Hour(horaSalida);

      if (entrada) payload.horaEntrada = entrada;
      if (salida) payload.horaSalida = salida;
      if (formData.observaciones?.trim()) {
        payload.observaciones = formData.observaciones;
      }

      await onCreate(payload);

      setFormData(initialFormData);
      setDate(undefined);
      setHoraEntrada(initialTimeValue);
      setHoraSalida(initialTimeValue);
      onOpenChange(false);
    } catch (error) {
      console.error("Error en handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Registrar Asistencia</DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Empleado */}
            <div>
              <Label htmlFor="empleado" className="mb-2">
                Empleado *
              </Label>
              <Select
                value={formData.empleadoId?.toString() || ""}
                onValueChange={(value) => handleChange("empleadoId", value)}
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

            {/* Fecha */}
            <div>
              <Label htmlFor="date" className="mb-2">
                Fecha *
              </Label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between font-normal w-full text-muted-foreground"
                  >
                    {date ? formatDateToISO(date) : "Selecciona una fecha"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;
                      setDate(selectedDate);
                      handleChange(
                        "fechaRegistro",
                        formatDateToISO(selectedDate),
                      );
                      setOpenPopover(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-4">
              <TimeInput
                label="Hora de Entrada"
                value={horaEntrada}
                onChange={setHoraEntrada}
              />
              <TimeInput
                label="Hora de Salida"
                value={horaSalida}
                onChange={setHoraSalida}
              />
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
                setFormData(initialFormData);
                setDate(undefined);
                setHoraEntrada(initialTimeValue);
                setHoraSalida(initialTimeValue);
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Asistencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
