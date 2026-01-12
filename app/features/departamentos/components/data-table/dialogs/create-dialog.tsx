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

interface DepartamentoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    nombreDepartamento: string;
    descripcion: string;
    idJefeDepartamento: number | null;
  }) => Promise<void>;
}

export function DepartamentoCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: DepartamentoCreateDialogProps) {
  const [formData, setFormData] = useState({
    nombreDepartamento: "",
    descripcion: "",
    idJefeDepartamento: null as number | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(formData);
      // Reset form
      setFormData({
        nombreDepartamento: "",
        descripcion: "",
        idJefeDepartamento: null,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear departamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Departamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreDepartamento">Nombre del Departamento</Label>
            <Input
              id="nombreDepartamento"
              value={formData.nombreDepartamento}
              onChange={(e) =>
                handleChange("nombreDepartamento", e.target.value)
              }
              placeholder="Ej: Sistemas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              placeholder="Descripción del departamento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idJefeDepartamento">ID del Jefe</Label>
            <Input
              id="idJefeDepartamento"
              type="number"
              min={0}
              value={formData.idJefeDepartamento ?? ""}
              onChange={(e) =>
                handleChange(
                  "idJefeDepartamento",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="ID del jefe del departamento"
            />
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
              {isSubmitting ? "Creando..." : "Crear Departamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
