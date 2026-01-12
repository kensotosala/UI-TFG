"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Puesto } from "../../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (puesto: Omit<Puesto, "idPuesto">) => Promise<void>;
  isLoading?: boolean;
}

export function PuestoCreateDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: Props) {
  const [form, setForm] = useState({
    nombrePuesto: "",
    descripcion: "",
    nivelJerarquico: 0,
    salarioMinimo: 0,
    salarioMaximo: 0,
    estado: true,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear puesto</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Nombre del puesto"
            value={form.nombrePuesto}
            onChange={(e) => handleChange("nombrePuesto", e.target.value)}
          />

          <Input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Nivel jerárquico"
            value={form.nivelJerarquico}
            onChange={(e) =>
              handleChange("nivelJerarquico", Number(e.target.value))
            }
          />

          <Input
            type="number"
            placeholder="Salario mínimo"
            value={form.salarioMinimo}
            onChange={(e) =>
              handleChange("salarioMinimo", Number(e.target.value))
            }
          />

          <Input
            type="number"
            placeholder="Salario máximo"
            value={form.salarioMaximo}
            onChange={(e) =>
              handleChange("salarioMaximo", Number(e.target.value))
            }
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
