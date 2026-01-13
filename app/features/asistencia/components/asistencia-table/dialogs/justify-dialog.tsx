// components/asistencias/dialogs/justificar-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertCircle } from "lucide-react";
import { TipoJustificacion } from "../../../types";

interface AsistenciaJustificarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistenciaId: string;
  empleadoNombre: string;
  onSave: (
    id: string,
    justificacion: {
      tipo: string;
      descripcion: string;
      documentoUrl?: string;
    }
  ) => void;
  isLoading: boolean;
}

type FormErrors = {
  tipo?: string;
  descripcion?: string;
};

export function AsistenciaJustificarDialog({
  open,
  onOpenChange,
  asistenciaId,
  empleadoNombre,
  onSave,
  isLoading,
}: AsistenciaJustificarDialogProps) {
  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    documentoUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.tipo) {
      newErrors.tipo = "Debe seleccionar un tipo de justificación";
    }

    if (!form.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    } else if (form.descripcion.trim().length < 10) {
      newErrors.descripcion =
        "La descripción debe tener al menos 10 caracteres";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(asistenciaId, {
        tipo: form.tipo,
        descripcion: form.descripcion,
        documentoUrl: form.documentoUrl || undefined,
      });
      // Reset form
      setForm({ tipo: "", descripcion: "", documentoUrl: "" });
      setErrors({});
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form al cerrar
      setForm({ tipo: "", descripcion: "", documentoUrl: "" });
      setErrors({});
    }
    onOpenChange(open);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Justificar Asistencia
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-5">
          {/* Información del empleado */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-xs text-blue-600 font-medium mb-1">Empleado</p>
            <p className="font-medium text-blue-900">{empleadoNombre}</p>
          </div>

          {/* Alerta informativa */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Información importante</p>
              <p>
                La justificación será revisada por su supervisor. Asegúrese de
                proporcionar información clara y verídica.
              </p>
            </div>
          </div>

          {/* Tipo de justificación */}
          <div className="space-y-2">
            <Label htmlFor="tipo">
              Tipo de Justificación <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.tipo}
              onValueChange={(value) => {
                setForm({ ...form, tipo: value });
                setErrors({ ...errors, tipo: undefined });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TipoJustificacion).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.tipo}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => {
                setForm({ ...form, descripcion: e.target.value });
                setErrors({ ...errors, descripcion: undefined });
              }}
              placeholder="Explica detalladamente el motivo de la ausencia o tardanza..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Mínimo 10 caracteres
              </span>
              <span
                className={`text-xs ${
                  form.descripcion.length < 10
                    ? "text-gray-400"
                    : "text-green-600"
                }`}
              >
                {form.descripcion.length} / 500
              </span>
            </div>
            {errors.descripcion && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* URL del documento (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="documentoUrl">
              URL del Documento Adjunto{" "}
              <span className="text-gray-400">(opcional)</span>
            </Label>
            <Input
              id="documentoUrl"
              type="url"
              value={form.documentoUrl}
              onChange={(e) =>
                setForm({ ...form, documentoUrl: e.target.value })
              }
              placeholder="https://ejemplo.com/documento.pdf"
            />
            <p className="text-xs text-gray-500">
              Si tienes un certificado médico u otro documento de respaldo,
              proporciona el enlace aquí.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={hasErrors || isLoading}>
              {isLoading ? "Enviando..." : "Enviar Justificación"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
