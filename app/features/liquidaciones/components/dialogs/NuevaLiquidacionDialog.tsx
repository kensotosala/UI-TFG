import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { CrearLiquidacionDTO, TipoDespido } from "../../types";

const formSchema = z.object({
  empleadoId: z.string().min(1, "Seleccione un empleado"),
  fechaSalida: z.date({ message: "Seleccione una fecha de salida" }),
  motivoLiquidacion: z.enum(
    Object.values(TipoDespido) as [string, ...string[]],
    { message: "Seleccione un tipo de despido" },
  ),
});

export function NuevaLiquidacionDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CrearLiquidacionDTO) => Promise<void>;
}) {
  const [date, setDate] = useState<Date>();
  const { empleados } = useEmpleados();
  const [selectedEmpleado, setSelectedEmpleado] = useState<string>("");
  const [selectedType, setSelectedType] = useState<TipoDespido | "">("");

  const reset = () => {
    setDate(undefined);
    setSelectedEmpleado("");
    setSelectedType("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = formSchema.safeParse({
      empleadoId: selectedEmpleado,
      fechaSalida: date,
      motivoLiquidacion: selectedType,
    });

    if (!payload.success) {
      console.error(payload.error.flatten());
      return;
    }

    onCreate({
      empleadoId: Number(payload.data.empleadoId),
      motivoLiquidacion: payload.data.motivoLiquidacion as TipoDespido,
      fechaSalida: format(payload.data.fechaSalida, "yyyy-MM-dd"),
      vacacionesPendientes: 0,
      preavisoEntregado: false,
    });

    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Calcular Nueva Liquidacion</DialogTitle>
            <DialogDescription className="mb-4">
              Complete los datos requeridos para calcular la liquidación del
              empleado.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="empleado">Empleado</Label>
              <Select
                value={selectedEmpleado}
                onValueChange={setSelectedEmpleado}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {empleados.map((item) => (
                      <SelectItem
                        key={item.idEmpleado}
                        value={item.idEmpleado.toString()}
                      >
                        {item.nombre} {item.primerApellido}{" "}
                        {item.segundoApellido}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Fecha de salida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <Label>Tipo de despido</Label>
              <Select
                value={selectedType}
                onValueChange={(val) => setSelectedType(val as TipoDespido)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un tipo de despido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={TipoDespido.RENUNCIA_RESPONSABILIDAD_PATRONAL}
                  >
                    Renuncia con responsabilidad patronal
                  </SelectItem>
                  <SelectItem
                    value={TipoDespido.DESPIDO_RESPONSABILIDAD_PATRONAL}
                  >
                    Despido con responsabilidad patronal
                  </SelectItem>
                  <SelectItem value={TipoDespido.DESPIDO_SIN_RESPONSABILIDAD}>
                    Despido sin causa
                  </SelectItem>
                  <SelectItem value={TipoDespido.JUBILACION}>
                    Jubilación
                  </SelectItem>
                  <SelectItem value={TipoDespido.RENUNCIA}>Renuncia</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Generar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
