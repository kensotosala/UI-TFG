/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import {
  ActualizarIncapacidadDTO,
  Incapacidad,
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
import { useEffect } from "react";

const incapacidadUpdateSchema = z
  .object({
    empleadoId: z.number().min(1, "Debes seleccionar un empleado"),
    diagnostico: z
      .string()
      .min(10, "El diagnóstico debe tener al menos 10 caracteres")
      .max(500, "El diagnóstico no debe exceder 500 caracteres"),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().min(1, "La fecha de finalización es obligatoria"),
    tipoIncapacidad: z
      .string()
      .min(1, "Debes seleccionar un tipo de incapacidad"),
    archivoAdjunto: z.string(),
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

type IncapacidadUpdateFormValues = z.infer<typeof incapacidadUpdateSchema>;

export interface IncapacidadUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incapacidad: Incapacidad | null;
  onUpdate: (data: ActualizarIncapacidadDTO) => Promise<void>;
}

export function IncapacidadUpdateDialog({
  open,
  onOpenChange,
  incapacidad,
  onUpdate,
}: IncapacidadUpdateDialogProps) {
  const { empleados = [] } = useEmpleados();

  const form = useForm<IncapacidadUpdateFormValues>({
    resolver: zodResolver(incapacidadUpdateSchema),
    defaultValues: {
      empleadoId: 0,
      fechaInicio: "",
      fechaFin: "",
      diagnostico: "",
      tipoIncapacidad: "",
      archivoAdjunto: "",
    },
  });

  // Cargar datos cuando se abre el diálogo con una incapacidad
  useEffect(() => {
    if (incapacidad && open) {
      form.reset({
        empleadoId: incapacidad.empleadoId,
        fechaInicio: incapacidad.fechaInicio.split("T")[0], // Convertir a formato YYYY-MM-DD
        fechaFin: incapacidad.fechaFin.split("T")[0],
        diagnostico: incapacidad.diagnostico,
        tipoIncapacidad: incapacidad.tipoIncapacidad,
        archivoAdjunto: incapacidad.archivoAdjunto || "",
      });
    }
  }, [incapacidad, open, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: IncapacidadUpdateFormValues) => {
    if (!incapacidad) return;

    try {
      const payload: ActualizarIncapacidadDTO = {
        incapacidadId: incapacidad.idIncapacidad, // Usar idIncapacidad del backend
        empleadoId: values.empleadoId,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        diagnostico: values.diagnostico,
        tipoIncapacidad: values.tipoIncapacidad,
        archivoAdjunto: values.archivoAdjunto,
      };

      await onUpdate(payload);
      handleClose();
    } catch (error: any) {
      const mensaje =
        error?.response?.message ?? error?.message ?? "Error desconocido";
      alert(`No se pudo actualizar la incapacidad: ${mensaje}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Registro de Incapacidad</DialogTitle>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input type="date" {...field} />
                  </FormControl>
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
                    <Input type="date" {...field} />
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
                  <FormLabel>URL del archivo</FormLabel>
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
