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
import { Empleado } from "../../../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartamentos } from "@/app/features/departamentos/hooks/useDepartamentos";
import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRoles } from "@/app/features/roles/hooks/useRoles";

type EmpleadoCreateForm = Omit<Empleado, "id" | "idEmpleado" | "estado"> & {
  nombreUsuario: string;
  password: string;
};

interface EmpleadoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: EmpleadoCreateForm) => Promise<void>;
}

const initialFormData: EmpleadoCreateForm = {
  codigoEmpleado: "",
  nombre: "",
  primerApellido: "",
  segundoApellido: "",
  email: "",
  telefono: "",
  fechaContratacion: "",
  puestoId: 0,
  departamentoId: 0,
  jefeInmediatoId: undefined,
  salarioBase: 0,
  tipoContrato: "FIJO",
  nombreUsuario: "",
  password: "",
  rolId: 0,
};

export function EmpleadoCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: EmpleadoCreateDialogProps) {
  const [formData, setFormData] = useState<EmpleadoCreateForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { departamentos } = useDepartamentos();
  const { roles } = useRoles();
  const { puestos } = usePuestos();
  const [openPopover, setOpenPopover] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleChange = <K extends keyof EmpleadoCreateForm>(
    field: K,
    value: EmpleadoCreateForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("📦 Payload enviado al backend:", formData);

      await onCreate(formData);

      setFormData(initialFormData);
      setDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear empleado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Crear Nuevo Empleado</DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="input-required" className="mb-2">
                Código
              </Label>
              <Input
                id="input-required"
                value={formData.codigoEmpleado}
                onChange={(e) => handleChange("codigoEmpleado", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Email
              </Label>
              <Input
                id="input-required"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Nombre
              </Label>
              <Input
                id="input-required"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Primer apellido
              </Label>
              <Input
                id="input-required"
                value={formData.primerApellido}
                onChange={(e) => handleChange("primerApellido", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Segundo apellido
              </Label>
              <Input
                id="input-required"
                value={formData.segundoApellido ?? ""}
                onChange={(e) =>
                  handleChange("segundoApellido", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Teléfono
              </Label>
              <Input
                id="input-required form-phone"
                type="tel"
                value={formData.telefono}
                placeholder="8888-8888"
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date" className="px-1 mb-2">
                Fecha de contratación
              </Label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between font-normal w-full text-muted-foreground"
                  >
                    {date ? formatDateToISO(date) : "Selecciona una fecha"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;

                      setDate(selectedDate);

                      handleChange(
                        "fechaContratacion",
                        formatDateToISO(selectedDate),
                      );

                      setOpenPopover(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Departamento
              </Label>
              <Select
                value={
                  formData.departamentoId
                    ? formData.departamentoId.toString()
                    : undefined
                }
                onValueChange={(value) =>
                  handleChange("departamentoId", Number(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departamentos</SelectLabel>
                    {departamentos.map((dep) => (
                      <SelectItem
                        key={dep.idDepartamento}
                        value={dep.idDepartamento.toString()}
                      >
                        {dep.nombreDepartamento}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Puesto
              </Label>
              <Select
                value={
                  formData.puestoId ? formData.puestoId.toString() : undefined
                }
                onValueChange={(value) =>
                  handleChange("puestoId", Number(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un puesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Puestos</SelectLabel>
                    {puestos.map((puesto) => (
                      <SelectItem
                        key={puesto.idPuesto}
                        value={puesto.idPuesto.toString()}
                      >
                        {puesto.nombrePuesto}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Rol
              </Label>
              <Select
                value={formData.rolId ? formData.rolId.toString() : undefined}
                onValueChange={(value) => handleChange("rolId", Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    {roles.map((rol) => (
                      <SelectItem key={rol.id} value={rol.id.toString()}>
                        {rol.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Salario base
              </Label>
              <Input
                id="input-required"
                min={100000}
                type="number"
                value={formData.salarioBase}
                onChange={(e) =>
                  handleChange("salarioBase", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Usuario
              </Label>
              <Input
                id="input-required"
                value={formData.nombreUsuario}
                onChange={(e) => handleChange("nombreUsuario", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="input-required" className="mb-2">
                Contraseña
              </Label>
              <Input
                id="input-required"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear empleado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
