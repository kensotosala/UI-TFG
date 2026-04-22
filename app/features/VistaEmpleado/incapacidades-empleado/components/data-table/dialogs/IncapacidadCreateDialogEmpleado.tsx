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
import {
  TIPOS_INCAPACIDAD,
  IncapacidadCreateDialogProps,
} from "@/app/features/incapacidades/types";
import { useAuthContext } from "@/components/providers/AuthProvider";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

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
        const hoy = new Date().toISOString().split("T")[0];
        return fecha >= hoy;
      }, "La fecha no puede ser en el pasado"),

    fechaFin: z
      .string()
      .min(1, "La fecha de finalización es obligatoria")
      .refine((fecha) => {
        const hoy = new Date().toISOString().split("T")[0];
        return fecha >= hoy;
      }, "La fecha no puede ser en el pasado"),

    tipoIncapacidad: z
      .string()
      .min(1, "Debes seleccionar un tipo de incapacidad"),

    archivoAdjunto: z
      .instanceof(File, { message: "Debes adjuntar la boleta de incapacidad" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        `El archivo no debe superar ${MAX_FILE_SIZE_MB}MB`,
      )
      .refine(
        (file) => ALLOWED_MIME_TYPES.includes(file.type),
        "Solo se permiten archivos PDF, JPG o PNG",
      ),
  })
  .refine(
    (data) => {
      if (!data.fechaInicio || !data.fechaFin) return true;
      return data.fechaFin >= data.fechaInicio;
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
}: IncapacidadCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  const form = useForm<IncapacidadFormValues>({
    resolver: zodResolver(incapacidadSchema),
    defaultValues: {
      fechaInicio: "",
      fechaFin: "",
      diagnostico: "",
      tipoIncapacidad: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: IncapacidadFormValues) => {
    if (!user?.employeeId) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        diagnostico: values.diagnostico,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        tipoIncapacidad: values.tipoIncapacidad,
        archivoAdjunto: values.archivoAdjunto,
        empleadoId: user?.employeeId,
      });
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hoyStr = new Date().toISOString().split("T")[0];

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
                      <Input type="date" min={hoyStr} {...field} />
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
                      <Input
                        type="date"
                        min={form.watch("fechaInicio") || hoyStr}
                        {...field}
                      />
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
                  <FormLabel>Boleta de Incapacidad*</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file ?? undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Formatos permitidos: PDF, JPG, PNG · Máximo{" "}
                    {MAX_FILE_SIZE_MB}MB
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
