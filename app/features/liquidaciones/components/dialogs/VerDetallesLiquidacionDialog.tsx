import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LiquidacionDTO } from "../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

export function VerDetallesLiquidacion({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LiquidacionDTO | null;
}) {
  const { empleados } = useEmpleados();

  const empleado = data
    ? empleados.find((e) => e.idEmpleado === data.idEmpleado)
    : null;

  const nombreEmpleado = empleado
    ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido || ""}`.trim()
    : "Desconocido";

  const formatCRC = (amount: number) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles Liquidación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Empleado
            </p>
            <p className="text-base">{nombreEmpleado}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monto Preaviso
            </p>
            <p className="text-base">
              {data ? formatCRC(data.montoPreaviso) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monto Vacaciones
            </p>
            <p className="text-base">
              {data ? formatCRC(data.montoVacaciones) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monto Aguinaldo
            </p>
            <p className="text-base">
              {data ? formatCRC(data.montoAguinaldo) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monto Cesantía
            </p>
            <p className="text-base">
              {data ? formatCRC(data.montoCesantia) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monto Total
            </p>
            <p className="text-base font-semibold">
              {data ? formatCRC(data.montoTotal) : "N/A"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
