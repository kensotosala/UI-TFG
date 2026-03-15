"use client";

import { TablaAguinaldosVistaEmpleado } from "@/app/features/VistaEmpleado/aguinaldo-empleado/components/Tabla/AguinaldoEmpleadoTable";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export default function MisAguinaldosPage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user?.employeeId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No se encontró información del empleado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TablaAguinaldosVistaEmpleado empleadoId={user.employeeId} />
    </div>
  );
}
