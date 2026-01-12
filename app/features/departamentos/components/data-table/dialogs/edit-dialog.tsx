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

import { useEffect, useState } from "react";
import { Departamento } from "@/app/features/departamentos/types";

interface DepartamentoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento: Departamento | null;
  onSave: (departamento: Departamento) => void;
  isLoading: boolean;
}

type FormErrors = {
  nombreDepartamento?: string;
};

export function DepartamentoEditDialog({
  open,
  onOpenChange,
  departamento,
  onSave,
  isLoading,
}: DepartamentoEditDialogProps) {
  const [form, setForm] = useState<Departamento | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(departamento);
    setErrors({});
  }, [departamento]);

  if (!form) return null;

  const validate = (data: Departamento): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nombreDepartamento.trim()) {
      newErrors.nombreDepartamento =
        "El nombre del departamento es obligatorio";
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
          <DialogTitle>Editar Departamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombreDepartamento">Nombre del Departamento</Label>
            <Input
              id="nombreDepartamento"
              value={form.nombreDepartamento}
              onChange={(e) => {
                const updated = { ...form, nombreDepartamento: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.nombreDepartamento && (
              <p className="text-sm text-red-500">
                {errors.nombreDepartamento}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={form.descripcion ?? ""}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          {/* ID del jefe */}
          <div className="space-y-2">
            <Label htmlFor="idJefeDepartamento">ID del Jefe</Label>
            <Input
              id="idJefeDepartamento"
              type="number"
              min={0}
              value={form.idJefeDepartamento ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  idJefeDepartamento: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
            />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <Switch
              id="estado"
              checked={form.estado === "ACTIVO"}
              onCheckedChange={(checked) =>
                setForm({ ...form, estado: checked ? "ACTIVO" : "INACTIVO" })
              }
            />
            <Label htmlFor="estado">Activo</Label>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
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
