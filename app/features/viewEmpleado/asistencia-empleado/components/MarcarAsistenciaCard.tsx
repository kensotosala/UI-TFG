"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useMarcarAsistencia } from "../hooks/useMarcarAsistencia";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const MarcarAsistenciaCard = () => {
  const { estado, isLoading, marcar, isMarking } = useMarcarAsistencia();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const puedeMarcar = estado?.puedeMarcarEntrada || estado?.puedeMarcarSalida;
  const accionTexto = estado?.puedeMarcarEntrada
    ? "Marcar Entrada"
    : "Marcar Salida";
  const Icon = estado?.puedeMarcarEntrada ? LogIn : LogOut;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Asistencia de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {estado?.tieneRegistro && (
          <div className="space-y-2 text-sm">
            {estado.horaEntrada && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entrada:</span>
                <span className="font-medium">
                  {format(new Date(estado.horaEntrada), "HH:mm:ss", {
                    locale: es,
                  })}
                </span>
              </div>
            )}
            {estado.horaSalida && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salida:</span>
                <span className="font-medium">
                  {format(new Date(estado.horaSalida), "HH:mm:ss", {
                    locale: es,
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium capitalize">{estado.estado}</span>
            </div>
          </div>
        )}

        {puedeMarcar ? (
          <Button
            onClick={() => marcar()}
            disabled={isMarking}
            className="w-full"
            size="lg"
          >
            <Icon className="h-4 w-4 mr-2" />
            {isMarking ? "Marcando..." : accionTexto}
          </Button>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-2">
            {estado?.mensaje || "No puedes marcar en este momento"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
