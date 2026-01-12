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

interface PuestoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    nombrePuesto: string;
    descripcion: string;
    nivelJerarquico: number;
    salarioMinimo: number;
    salarioMaximo: number;
  }) => Promise<void>;
}

export function PuestoCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: PuestoCreateDialogProps) {
  const [formData, setFormData] = useState({
    nombrePuesto: "",
    descripcion: "",
    nivelJerarquico: 1,
    salarioMinimo: 0,
    salarioMaximo: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(formData);
      // Reset form
      setFormData({
        nombrePuesto: "",
        descripcion: "",
        nivelJerarquico: 1,
        salarioMinimo: 0,
        salarioMaximo: 0,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear puesto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Puesto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombrePuesto">Nombre del Puesto</Label>
            <Input
              id="nombrePuesto"
              value={formData.nombrePuesto}
              onChange={(e) => handleChange("nombrePuesto", e.target.value)}
              placeholder="Ej: Desarrollador Senior"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              placeholder="Descripción del puesto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivelJerarquico">Nivel Jerárquico</Label>
            <Input
              id="nivelJerarquico"
              type="number"
              min="1"
              value={formData.nivelJerarquico}
              onChange={(e) =>
                handleChange("nivelJerarquico", parseInt(e.target.value) || 1)
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salarioMinimo">Salario Mínimo</Label>
              <Input
                id="salarioMinimo"
                type="number"
                step="0.01"
                min="0"
                value={formData.salarioMinimo}
                onChange={(e) =>
                  handleChange("salarioMinimo", parseFloat(e.target.value) || 0)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salarioMaximo">Salario Máximo</Label>
              <Input
                id="salarioMaximo"
                type="number"
                step="0.01"
                min="0"
                value={formData.salarioMaximo}
                onChange={(e) =>
                  handleChange("salarioMaximo", parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Puesto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
