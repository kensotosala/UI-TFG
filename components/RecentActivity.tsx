"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { useAuditoriaCambios } from "@/app/features/auditoria/hooks/useAuditoriaCambios";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

const RecentActivity = () => {
  const { data, isLoading, error } = useAuditoriaCambios();
  const { empleados } = useEmpleados();

  const empleadosMap = useMemo(() => {
    const map = new Map<number, string>();
    empleados.forEach((e) => {
      map.set(
        e.idEmpleado,
        `${e.nombre} ${e.primerApellido} ${e.segundoApellido ?? ""}`.trim(),
      );
    });
    return map;
  }, [empleados]);

  if (isLoading) return <p>Cargando actividad...</p>;
  if (error) return <p>Error al cargar logs</p>;

  const items = data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {items.slice(0, 6).map((item) => {
            const nombre =
              empleadosMap.get(item.usuarioId) ?? `Usuario #${item.usuarioId}`;

            return (
              <div
                key={item.idAuditoria}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="h-2 w-2 rounded-full bg-green-500" />

                <p className="text-sm flex-1">
                  <span className="font-medium">{nombre}</span>{" "}
                  {item.descripcion}
                </p>

                <span className="text-xs text-muted-foreground">
                  {item.fechaCreacion
                    ? new Date(item.fechaCreacion).toLocaleString()
                    : "—"}
                </span>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay actividad reciente.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
