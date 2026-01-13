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

// ✅ CORREGIDO: Usar fechaRegistro en lugar de fecha
const initialFormData: CrearAsistenciaDTO = {
  empleadoId: "",
  fechaRegistro: "", // ✅ CORREGIDO
  horaEntrada: "",
  horaSalida: "",
  estado: EstadoAsistencia.PRESENTE,
  observaciones: "",
};

export function AsistenciaCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: AsistenciaCreateDialogProps) {
  const [formData, setFormData] = useState<CrearAsistenciaDTO>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { empleados } = useEmpleados();

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleChange = <K extends keyof CrearAsistenciaDTO>(
    field: K,
    value: CrearAsistenciaDTO[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validaciones antes de enviar
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

      // Preparar payload - El servicio se encargará del formato
      const payload: CrearAsistenciaDTO = {
        empleadoId: formData.empleadoId,
        fechaRegistro: formData.fechaRegistro,
        estado: formData.estado,
      };

      // Solo agregar horaEntrada si existe y no está vacía
      if (formData.horaEntrada && formData.horaEntrada.trim() !== "") {
        payload.horaEntrada = formData.horaEntrada;
      }

      // Solo agregar horaSalida si existe y no está vacía
      if (formData.horaSalida && formData.horaSalida.trim() !== "") {
        payload.horaSalida = formData.horaSalida;
      }

      // Solo agregar observaciones si existen y no están vacías
      if (formData.observaciones && formData.observaciones.trim() !== "") {
        payload.observaciones = formData.observaciones;
      }

      console.log("📝 Datos del formulario:", payload);

      await onCreate(payload);

      // Resetear formulario y cerrar diálogo
      setFormData(initialFormData);
      setDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
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
                      // ✅ CORREGIDO: Usar fechaRegistro
                      handleChange(
                        "fechaRegistro",
                        formatDateToISO(selectedDate)
                      );
                      setOpenPopover(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
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
                    value={formData.horaEntrada || ""}
                    onChange={(e) =>
                      handleChange("horaEntrada", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
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
                    value={formData.horaSalida || ""}
                    onChange={(e) => handleChange("horaSalida", e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                setFormData(initialFormData);
                setDate(undefined);
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
