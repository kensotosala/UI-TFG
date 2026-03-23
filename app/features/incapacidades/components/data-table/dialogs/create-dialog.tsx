/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import {
  IncapacidadCreateDialogProps,
  RegistrarIncapacidadDTO,
  TIPOS_INCAPACIDAD,
} from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
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
import { useState } from "react";

function parseFechaLocal(fecha: string): Date {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getFechaHoyLocal(): Date {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const incapacidadSchema = z
  .object({
    empleadoId: z.number().min(1, "Debes seleccionar un empleado"),

    diagnostico: z
      .string()
      .min(10, "El diagnóstico debe tener al menos 10 caracteres")
      .max(500, "El diagnóstico no debe exceder 500 caracteres"),

    fechaInicio: z
      .string()
      .min(1, "La fecha de inicio es obligatoria")
      .refine((fecha) => {
        return parseFechaLocal(fecha) >= getFechaHoyLocal();
      }, "La fecha de inicio no puede ser en el pasado"),

    fechaFin: z
      .string()
      .min(1, "La fecha de finalización es obligatoria")
      .refine((fecha) => {
        return parseFechaLocal(fecha) >= getFechaHoyLocal();
      }, "La fecha de fin no puede ser en el pasado"),

    tipoIncapacidad: z
      .string()
      .min(1, "Debes seleccionar un tipo de incapacidad"),

    archivoAdjunto: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        `El archivo no debe superar ${MAX_FILE_SIZE_MB}MB`,
      )
      .refine(
        (file) => !file || ALLOWED_MIME_TYPES.includes(file.type),
        "Solo se permiten archivos PDF, JPG o PNG",
      ),
  })
  .refine(
    (data) => {
      if (!data.fechaInicio || !data.fechaFin) return true;
      return (
        parseFechaLocal(data.fechaFin) >= parseFechaLocal(data.fechaInicio)
      );
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["fechaFin"],
    },
  );

type IncapacidadFormValues = z.infer<typeof incapacidadSchema>;

export function IncapacidadCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: IncapacidadCreateDialogProps) {
  const { empleados = [] } = useEmpleados();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<IncapacidadFormValues>({
    resolver: zodResolver(incapacidadSchema),
    defaultValues: {
      empleadoId: 0,
      fechaInicio: "",
      fechaFin: "",
      diagnostico: "",
      tipoIncapacidad: "",
      archivoAdjunto: undefined,
    },
  });

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onOpenChange(false);
  };

  const onSubmit = async (values: IncapacidadFormValues) => {
    try {
      if (!values.archivoAdjunto) {
        setSubmitError("Debes adjuntar un archivo");
        return;
      }
      const payload: RegistrarIncapacidadDTO = {
        empleadoId: values.empleadoId,
        diagnostico: values.diagnostico,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        tipoIncapacidad: values.tipoIncapacidad,
        archivoAdjunto: values.archivoAdjunto,
      };

      await onCreate(payload);
      handleClose();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ?? error?.message ?? "Error desconocido";

      setSubmitError(`No se pudo registrar: ${mensaje}`);
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
            {submitError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            {/* Empleado */}
            <FormField
              control={form.control}
              name="empleadoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado*</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un empleado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {empleados.map((e) => (
                        <SelectItem
                          key={e.idEmpleado}
                          value={String(e.idEmpleado)}
                        >
                          {e.nombre} {e.primerApellido} {e.segundoApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Incapacidad */}
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

            {/* Diagnóstico */}
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

            {/* Fecha Inicio */}
            <FormField
              control={form.control}
              name="fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Inicio*</FormLabel>
                  <FormControl>
                    <Input type="date" min={hoyStr} {...field} />
                  </FormControl>
                  <FormDescription>No puede ser en el pasado</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha Fin */}
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
                  <FormDescription>
                    Debe ser posterior o igual a la fecha de inicio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Archivo Adjunto */}
            <FormField
              control={form.control}
              name="archivoAdjunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boleta de Incapacidad</FormLabel>
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
