"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface PermisoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    fechaPermiso: string;
    motivo: string;
    conGoceSalario: boolean;
  }) => Promise<void>;
}

export const PermisoCreateDialog = ({
  open,
  onOpenChange,
  onCreate,
}: PermisoCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fechaPermiso: "",
    motivo: "",
    conGoceSalario: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(formData);
      setFormData({
        fechaPermiso: "",
        motivo: "",
        conGoceSalario: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Permiso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fechaPermiso" className="mb-3">
              Fecha del Permiso
            </Label>
            <Input
              id="fechaPermiso"
              type="date"
              value={formData.fechaPermiso}
              onChange={(e) =>
                setFormData({ ...formData, fechaPermiso: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="motivo" className="mb-3">
              Motivo
            </Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              placeholder="Describe brevemente el motivo de tu solicitud..."
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="conGoceSalario"
              checked={formData.conGoceSalario}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  conGoceSalario: checked as boolean,
                })
              }
            />
            <Label
              htmlFor="conGoceSalario"
              className="text-sm font-normal cursor-pointer"
            >
              Con goce de salario
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Solicitar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
