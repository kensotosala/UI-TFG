"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { aguinaldoService } from "../services/aguinaldo.service";
import { AguinaldoDTO } from "../types";
import { toast } from "sonner";

export function useAguinaldoEmpleado(empleadoId: number) {
  const [aguinaldos, setAguinaldos] = useState<AguinaldoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAguinaldos = useCallback(async () => {
    if (!empleadoId) return;

    try {
      setIsLoading(true);

      const data = await aguinaldoService.obtenerPorEmpleado(empleadoId);

      setAguinaldos(
        [...data].sort(
          (a, b) =>
            new Date(b.fechaCalculo ?? 0).getTime() -
            new Date(a.fechaCalculo ?? 0).getTime(),
        ),
      );
    } catch (error: unknown) {
      toast.error("Error al cargar aguinaldos", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  }, [empleadoId]);

  useEffect(() => {
    fetchAguinaldos();
  }, [fetchAguinaldos]);

  const stats = useMemo(() => {
    const pagados = aguinaldos.filter((a) => a.estado === "PAGADO");

    const pagadosConFecha = pagados.filter((a) => a.fechaPago != null);

    const ultimoAguinaldo =
      pagadosConFecha.length > 0
        ? pagadosConFecha.sort(
            (a, b) =>
              new Date(b.fechaPago ?? 0).getTime() -
              new Date(a.fechaPago ?? 0).getTime(),
          )[0]
        : null;

    return {
      totalAguinaldos: aguinaldos.length,
      totalRecibido: pagados.reduce(
        (sum, a) => sum + (a.montoAguinaldo ?? 0),
        0,
      ),
      ultimoAguinaldo,
      pendientes: aguinaldos.filter((a) => a.estado === "PENDIENTE").length,
    };
  }, [aguinaldos]);

  return {
    aguinaldos,
    isLoading,
    stats,
    refetch: fetchAguinaldos,
  };
}
