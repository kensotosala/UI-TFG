"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AguinaldoDTO } from "@/app/features/aguinaldos/types";

interface Props {
  open: boolean;
  onClose: () => void;
  aguinaldo: AguinaldoDTO | null;
}

export function AguinaldoEmpleadoDetailsDialog({
  open,
  onClose,
  aguinaldo,
}: Props) {
  if (!aguinaldo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Aguinaldo {new Date(aguinaldo.fechaCalculo).getFullYear()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Días trabajados:</span>
            <span className="font-semibold">{aguinaldo.diasTrabajados}</span>
          </div>

          <div className="flex justify-between">
            <span>Salario promedio:</span>
            <span>₡{aguinaldo.salarioPromedio.toLocaleString("es-CR")}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-700">
            <span>Monto aguinaldo:</span>
            <span>₡{aguinaldo.montoAguinaldo.toLocaleString("es-CR")}</span>
          </div>

          <div className="flex justify-between">
            <span>Estado:</span>
            <Badge>{aguinaldo.estado}</Badge>
          </div>

          <div className="flex justify-between">
            <span>Fecha de pago:</span>
            <span>
              {aguinaldo.fechaPago
                ? new Date(aguinaldo.fechaPago).toLocaleDateString("es-CR")
                : "Pendiente"}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
