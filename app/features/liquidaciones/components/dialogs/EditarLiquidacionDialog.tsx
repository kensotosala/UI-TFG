import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditarLiquidacionDTO, LiquidacionDTO } from "../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FormFields = {
  montoPreaviso: number;
  montoVacaciones: number;
  montoAguinaldo: number;
  montoCesantia: number;
};

const FORM_INICIAL: FormFields = {
  montoPreaviso: 0,
  montoVacaciones: 0,
  montoAguinaldo: 0,
  montoCesantia: 0,
};

const EditarLiquidacionDialog = ({
  open,
  onOpenChange,
  data,
  onEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LiquidacionDTO | null;
  onEdit: (payload: EditarLiquidacionDTO) => Promise<void>;
}) => {
  const { empleados } = useEmpleados();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const empleado = data
    ? empleados.find((e) => e.idEmpleado === data.idEmpleado)
    : null;

  const nombreEmpleado = empleado
    ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido ?? ""}`.trim()
    : "Desconocido";

  const [form, setForm] = useState<FormFields>(FORM_INICIAL);

  useEffect(() => {
    if (open && data) {
      setForm({
        montoPreaviso: data.montoPreaviso,
        montoVacaciones: data.montoVacaciones,
        montoAguinaldo: data.montoAguinaldo,
        montoCesantia: data.montoCesantia,
      });
    }
    if (!open) {
      setForm(FORM_INICIAL);
    }
  }, [open, data]);

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSubmit = async () => {
    if (!data) return;

    const valores = Object.values(form);
    if (valores.some((v) => isNaN(v) || v < 0)) {
      toast.error("Todos los montos deben ser números válidos y no negativos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit({
        id: data.idLiquidacion,
        montoPreaviso: Number(form.montoPreaviso),
        montoVacaciones: Number(form.montoVacaciones),
        montoAguinaldo: Number(form.montoAguinaldo),
        montoCesantia: Number(form.montoCesantia),
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al editar liquidación:", error);
      toast.error("No se pudo guardar la liquidación. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Liquidación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Empleado</Label>
            <p className="text-sm">{nombreEmpleado}</p>
          </div>

          {(
            [
              ["montoPreaviso", "Monto Preaviso"],
              ["montoVacaciones", "Monto Vacaciones"],
              ["montoAguinaldo", "Monto Aguinaldo"],
              ["montoCesantia", "Monto Cesantía"],
            ] as [keyof FormFields, string][]
          ).map(([field, label]) => (
            <div key={field}>
              <Label>{label}</Label>
              <Input
                type="number"
                min={0}
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditarLiquidacionDialog;
