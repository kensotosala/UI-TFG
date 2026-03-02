import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { AlertTriangle } from "lucide-react";
import { LiquidacionDTO } from "../../types";

interface AnularLiquidacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LiquidacionDTO | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

export function AnularLiquidacionDialog({
  open,
  onOpenChange,
  data,
  isDeleting,
  onConfirm,
}: AnularLiquidacionProps) {
  const { empleados } = useEmpleados();

  const empleado = data
    ? empleados.find((e) => e.idEmpleado === data.idEmpleado)
    : null;

  const nombreEmpleado = empleado
    ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido || ""}`.trim()
    : "No encontrado";

  const handleConfirm = async () => {
    if (!data) return;
    await onConfirm(data.idLiquidacion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Anular Liquidación</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción no se puede deshacer. Se anulará permanentemente el
            registro de liquidación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm">
            <span className="font-medium">Empleado: </span>
            {nombreEmpleado}
          </p>
          <p className="text-sm">
            <span className="font-medium">Monto Total: </span>
            {data
              ? new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: "CRC",
                }).format(data.montoTotal)
              : "N/A"}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || !data}
          >
            {isDeleting ? "Anulando..." : "Anular"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
