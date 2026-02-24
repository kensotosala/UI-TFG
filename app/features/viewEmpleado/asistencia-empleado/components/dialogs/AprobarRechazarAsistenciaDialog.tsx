import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AprobarRechazarAsistenciaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tipo: "entrada" | "salida";
}

const AprobarRechazarAsistenciaDialog = ({
  isOpen,
  onClose,
  onConfirm,
  tipo,
}: AprobarRechazarAsistenciaDialogProps) => {
  const esEntrada = tipo === "entrada";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {esEntrada ? "Confirmar entrada" : "Confirmar salida"}
          </DialogTitle>
          <DialogDescription>
            {esEntrada
              ? "Estás a punto de registrar tu hora de entrada. ¿Deseas continuar?"
              : "Estás a punto de registrar tu hora de salida. ¿Deseas continuar?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm}>
            {esEntrada ? "Confirmar entrada" : "Confirmar salida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AprobarRechazarAsistenciaDialog;
