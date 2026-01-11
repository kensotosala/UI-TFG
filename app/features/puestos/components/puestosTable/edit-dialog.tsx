/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Puesto } from "../../types";
import { useEffect, useState } from "react";

interface PuestoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puesto: Puesto | null;
  onSave: (puesto: Puesto) => void;
}

type FormErrors = {
  nombrePuesto?: string;
  salarioMinimo?: string;
  salarioMaximo?: string;
};

export function PuestoEditDialog({
  open,
  onOpenChange,
  puesto,
  onSave,
}: PuestoEditDialogProps) {
  const [form, setForm] = useState<Puesto | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(puesto);
    setErrors({});
  }, [puesto]);

  if (!form) return null;

  const validate = (data: Puesto): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nombrePuesto.trim()) {
      newErrors.nombrePuesto = "El nombre del puesto es obligatorio";
    }

    if (data.salarioMinimo < 0) {
      newErrors.salarioMinimo = "El salario mínimo no puede ser menor a 0";
    }

    if (data.salarioMaximo < 0) {
      newErrors.salarioMaximo = "El salario máximo no puede ser menor a 0";
    }

    if (data.salarioMaximo < data.salarioMinimo) {
      newErrors.salarioMaximo =
        "El salario máximo no puede ser menor al salario mínimo";
    }

    return newErrors;   
  };

  const handleSave = () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(form);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Puesto</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombrePuesto">Nombre del puesto</Label>
            <Input
              id="nombrePuesto"
              value={form.nombrePuesto}
              onChange={(e) => {
                const updated = {
                  ...form,
                  nombrePuesto: e.target.value,
                };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.nombrePuesto && (
              <p className="text-sm text-red-500">{errors.nombrePuesto}</p>
            )}
          </div>

          {/* Salario mínimo */}
          <div className="space-y-2">
            <Label htmlFor="salarioMinimo">Salario mínimo</Label>
            <Input
              id="salarioMinimo"
              type="number"
              min={0}
              value={form.salarioMinimo}
              onChange={(e) => {
                const updated = {
                  ...form,
                  salarioMinimo: Number(e.target.value),
                };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.salarioMinimo && (
              <p className="text-sm text-red-500">{errors.salarioMinimo}</p>
            )}
          </div>

          {/* Salario máximo */}
          <div className="space-y-2">
            <Label htmlFor="salarioMaximo">Salario máximo</Label>
            <Input
              id="salarioMaximo"
              type="number"
              min={0}
              value={form.salarioMaximo}
              onChange={(e) => {
                const updated = {
                  ...form,
                  salarioMaximo: Number(e.target.value),
                };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.salarioMaximo && (
              <p className="text-sm text-red-500">{errors.salarioMaximo}</p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <Switch
              id="estado"
              checked={form.estado}
              onCheckedChange={(checked) =>
                setForm({ ...form, estado: checked })
              }
            />
            <Label htmlFor="estado">Activo</Label>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={hasErrors}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
