"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Departamento } from "../../../types";

interface DepartamentoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento: Departamento | null;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DepartamentoDeleteDialog({
  open,
  onOpenChange,
  departamento,
  onConfirm,
  isDeleting = false,
}: DepartamentoDeleteDialogProps) {
  if (!departamento) return null;

  const handleDelete = async () => {
    await onConfirm(departamento.idDepartamento);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Eliminar departamento
          </DialogTitle>

          <DialogDescription className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar el departamento{" "}
              <span className="font-medium">
                {departamento.nombreDepartamento}
              </span>
              ?
            </p>
            <p className="text-sm text-red-500">
              Esta acción no se puede deshacer.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
