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
import { Empleado } from "@/app/features/empleados/types";

interface EmpleadoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  onSave: (empleado: Empleado) => void;
  isLoading: boolean;
}

type FormErrors = {
  nombre?: string;
  primerApellido?: string;
  email?: string;
  telefono?: string;
};

export function EmpleadoEditDialog({
  open,
  onOpenChange,
  empleado,
  onSave,
  isLoading,
}: EmpleadoEditDialogProps) {
  const [form, setForm] = useState<Empleado | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(empleado);
    setErrors({});
  }, [empleado]);

  if (!form) return null;

  const validate = (data: Empleado): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!data.primerApellido.trim())
      newErrors.primerApellido = "El primer apellido es obligatorio";
    if (!data.email.trim()) newErrors.email = "El email es obligatorio";

    if (!data.telefono || data.telefono.length !== 8) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(form);
      onOpenChange(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => {
                const updated = { ...form, nombre: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          {/* Primer Apellido */}
          <div className="space-y-2">
            <Label htmlFor="primerApellido">Primer Apellido</Label>
            <Input
              id="primerApellido"
              value={form.primerApellido}
              onChange={(e) => {
                const updated = { ...form, primerApellido: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.primerApellido && (
              <p className="text-sm text-red-500">{errors.primerApellido}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => {
                const updated = { ...form, email: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={form.telefono ?? ""}
              placeholder="88888888"
              maxLength={8}
              inputMode="numeric"
              pattern="[0-9]{8}"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 8) {
                  setForm({ ...form, telefono: value });
                }
              }}
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
