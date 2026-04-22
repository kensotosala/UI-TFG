"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Departamento } from "../../../types";

interface DepartamentoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento: Departamento | null;
}

export function DepartamentoDetailsDialog({
  open,
  onOpenChange,
  departamento,
}: DepartamentoDetailsDialogProps) {
  if (!departamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalle del Departamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">{departamento.idDepartamento}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Estado</p>
              <Badge
                variant={
                  departamento.estado === "ACTIVO" ? "default" : "secondary"
                }
              >
                {departamento.estado}
              </Badge>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Nombre</p>
              <p className="font-medium">{departamento.nombreDepartamento}</p>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Descripción</p>
              <p>{departamento.descripcion}</p>
            </div>

            {/* <div>
              <p className="text-muted-foreground">Jefe de Departamento</p>
              <p>{departamento.idJefeDepartamento ?? "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Creado</p>
              <p>
                {departamento.fechaCreacion
                  ? new Date(departamento.fechaCreacion).toLocaleDateString(
                      "es-ES"
                    )
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Última modificación</p>
              <p>
                {departamento.fechaModificacion
                  ? new Date(departamento.fechaModificacion).toLocaleDateString(
                      "es-ES"
                    )
                  : "-"}
              </p>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
