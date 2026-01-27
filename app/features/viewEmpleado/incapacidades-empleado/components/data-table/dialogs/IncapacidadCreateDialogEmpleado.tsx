"use client";

import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TIPOS_INCAPACIDAD } from "../../../types";

interface IncapacidadCreateDialogEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    diagnostico: string;
    fechaInicio: string;
    fechaFin: string;
    tipoIncapacidad: string;
    archivoAdjunto: string | null;
  }) => Promise<void>;
}

const incapacidadSchema = z
  .object({
    diagnostico: z
      .string()
      .min(10, "El diagnóstico debe tener al menos 10 caracteres")
      .max(500, "El diagnóstico no debe exceder 500 caracteres"),
    fechaInicio: z
      .string()
      .min(1, "La fecha de inicio es obligatoria")
      .refine((fecha) => {
        const incapacidad = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return incapacidad >= hoy;
      }, "La fecha no puede ser en el pasado"),
    fechaFin: z
      .string()
      .min(1, "La fecha de finalización es obligatoria")
      .refine((fecha) => {
        const incapacidad = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return incapacidad >= hoy;
      }, "La fecha no puede ser en el pasado"),
    tipoIncapacidad: z
      .string()
      .min(1, "Debes seleccionar un tipo de incapacidad"),
    archivoAdjunto: z.string().optional(),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      return fin >= inicio;
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["fechaFin"],
    },
  );

type IncapacidadFormValues = z.infer<typeof incapacidadSchema>;

export function IncapacidadCreateDialogEmpleado({
  open,
  onOpenChange,
  onCreate,
}: IncapacidadCreateDialogEmpleadoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IncapacidadFormValues>({
    resolver: zodResolver(incapacidadSchema),
    defaultValues: {
      fechaInicio: "",
      fechaFin: "",
      diagnostico: "",
      tipoIncapacidad: "",
      archivoAdjunto: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: IncapacidadFormValues) => {
    setIsSubmitting(true);
    try {
      await onCreate({
        diagnostico: values.diagnostico,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        tipoIncapacidad: values.tipoIncapacidad,
        archivoAdjunto: values.archivoAdjunto || null,
      });
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Registro de Incapacidad</DialogTitle>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipoIncapacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Incapacidad*</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TIPOS_INCAPACIDAD.ENFERMEDAD}>
                        Enfermedad
                      </SelectItem>
                      <SelectItem value={TIPOS_INCAPACIDAD.ACCIDENTE}>
                        Accidente
                      </SelectItem>
                      <SelectItem value={TIPOS_INCAPACIDAD.MATERNIDAD}>
                        Maternidad
                      </SelectItem>
                      <SelectItem value={TIPOS_INCAPACIDAD.PATERNIDAD}>
                        Paternidad
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el diagnóstico médico..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo 10 caracteres, máximo 500
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="archivoAdjunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del archivo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/incapacidad.pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingresa la URL del archivo de incapacidad
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
