"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Puesto } from "../../types";

interface PuestoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puesto: Puesto | null;
}

export function PuestoDetailsDialog({
  open,
  onOpenChange,
  puesto,
}: PuestoDetailsDialogProps) {
  if (!puesto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalle del Puesto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">{puesto.idPuesto}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Estado</p>
              <Badge variant={puesto.estado ? "default" : "secondary"}>
                {puesto.estado ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Nombre</p>
              <p className="font-medium">{puesto.nombrePuesto}</p>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Descripción</p>
              <p>{puesto.descripcion}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Salario Mínimo</p>
              <p>${puesto.salarioMinimo.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Salario Máximo</p>
              <p>${puesto.salarioMaximo.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Creado</p>
              <p>
                {new Date(puesto.fechaCreacion).toLocaleDateString("es-ES")}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Última modificación</p>
              <p>
                {puesto.fechaModificacion
                  ? new Date(puesto.fechaModificacion).toLocaleDateString(
                      "es-ES"
                    )
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
