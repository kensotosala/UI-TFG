"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Info, LogIn, LogOut } from "lucide-react";
import { useMarcarAsistencia } from "../hooks/useMarcarAsistencia";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useHoraExtraActivaQuery } from "@/app/features/horas-extra/queries/horasExtra.queries";
import { useState } from "react";
import AprobarRechazarAsistenciaDialog from "./dialogs/AprobarRechazarAsistenciaDialog";

export const MarcarAsistenciaCard = () => {
  const { user } = useAuthContext();
  const { estado, isLoading, marcar, isMarking } = useMarcarAsistencia();

  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => setModalOpen(true);
  const cerrarModal = () => setModalOpen(false);

  const tipoAccion = estado?.puedeMarcarEntrada ? "entrada" : "salida";

  const confirmarAccion = () => {
    marcar();
    cerrarModal();
  };

  const { data: horaExtraActiva } = useHoraExtraActivaQuery(
    user?.employeeId ?? 0,
  );

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

  const tieneHoraExtra =
    horaExtraActiva?.tieneHoraExtra &&
    horaExtraActiva.inicio &&
    horaExtraActiva.fin;

  return (
    <>
      <Card className="flex flex-col max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Asistencia de Hoy
            </div>

            {tieneHoraExtra && (
              <Tooltip>
                <TooltipTrigger>
                  <Info size={15} className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="mb-2">
                    Recuerda que tienes horas extras registradas para hoy:
                  </p>
                  <p>
                    Inicio:{" "}
                    <span className="font-medium">
                      {format(new Date(horaExtraActiva!.inicio!), "hh:mm a", {
                        locale: es,
                      })}
                    </span>
                  </p>
                  <p>
                    Fin:{" "}
                    <span className="font-medium">
                      {format(new Date(horaExtraActiva!.fin!), "hh:mm a", {
                        locale: es,
                      })}
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
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
              onClick={abrirModal}
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

      <AprobarRechazarAsistenciaDialog
        isOpen={modalOpen}
        onClose={cerrarModal}
        onConfirm={confirmarAccion}
        tipo={tipoAccion}
      />
    </>
  );
};
