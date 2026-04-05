/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { aguinaldoService } from "../services/aguinaldo.service";
import {
  AguinaldoDTO,
  CalcularAguinaldoMasivoDTO,
  ResultadoCalculoAguinaldoDTO,
  ResumenAguinaldoDTO,
} from "../types";
import { toast } from "sonner";

export function useAguinaldo(anio?: number) {
  const [aguinaldos, setAguinaldos] = useState<AguinaldoDTO[]>([]);
  const [resumen, setResumen] = useState<ResumenAguinaldoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAguinaldos = async () => {
    try {
      setIsLoading(true);

      if (anio) {
        const data = await aguinaldoService.obtenerPorAnio(anio);
        setAguinaldos(data);

        // Obtener resumen también
        const resumenData = await aguinaldoService.obtenerResumen(anio);
        setResumen(resumenData);
      } else {
        const data = await aguinaldoService.obtenerTodos();
        setAguinaldos(data);
      }
    } catch (error: any) {
      toast.error("Error al cargar aguinaldos", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAguinaldos();
  }, [anio]);

  const calcularAguinaldosMasivo = async (
    dto: CalcularAguinaldoMasivoDTO,
  ): Promise<ResultadoCalculoAguinaldoDTO[]> => {
    setIsCalculating(true);
    try {
      const resultados = await aguinaldoService.calcularAguinaldoMasivo(dto);

      toast.success(`Se calcularon ${resultados.length} aguinaldos`, {
        description: "Revisa los resultados antes de registrar",
      });

      return resultados;
    } catch (error: any) {
      toast.error("Error al calcular aguinaldos", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsCalculating(false);
    }
  };

  const registrarAguinaldos = async (
    anio: number,
    calculos: ResultadoCalculoAguinaldoDTO[],
  ) => {
    setIsRegistering(true);
    try {
      const resultado = await aguinaldoService.registrarAguinaldos({
        anio,
        calculos,
      });

      if (resultado.fallidos > 0) {
        toast.warning(`Se registraron ${resultado.exitosos} aguinaldos`, {
          description: `${resultado.fallidos} fallaron. Ver consola para detalles.`,
        });
        console.error("Errores al registrar:", resultado.errores);
      } else {
        toast.success(`✅ ${resultado.exitosos} aguinaldos registrados`, {
          description: `Total: ₡${(resultado.datos ?? [])
            .reduce((sum, a) => sum + a.montoAguinaldo, 0)
            .toLocaleString("es-CR")}`,
        });
      }

      await fetchAguinaldos();
    } catch (error: any) {
      toast.error("Error al registrar aguinaldos", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const pagarAguinaldo = async (id: number, fechaPago: string) => {
    setIsPaying(true);
    try {
      await aguinaldoService.pagarAguinaldo(id, fechaPago);

      toast.success("Aguinaldo pagado exitosamente");

      await fetchAguinaldos();
    } catch (error: any) {
      toast.error("Error al pagar aguinaldo", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsPaying(false);
    }
  };

  const pagarAguinaldosMasivo = async (ids: number[], fechaPago: string) => {
    setIsPaying(true);
    try {
      const resultado = await aguinaldoService.pagarAguinaldosMasivo({
        idsAguinaldos: ids,
        fechaPago,
      });

      if (resultado.fallidos > 0) {
        toast.warning(`Se pagaron ${resultado.exitosos} aguinaldos`, {
          description: `${resultado.fallidos} fallaron`,
        });
        console.error("Errores:", resultado.errores);
      } else {
        toast.success(`✅ ${resultado.exitosos} aguinaldos pagados`);
      }

      await fetchAguinaldos();
    } catch (error: any) {
      toast.error("Error al pagar aguinaldos", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsPaying(false);
    }
  };

  const anularAguinaldo = async (id: number) => {
    setIsDeleting(true);
    try {
      await aguinaldoService.anularAguinaldo(id);

      toast.success("Aguinaldo anulado exitosamente");

      await fetchAguinaldos();
    } catch (error: any) {
      toast.error("Error al anular aguinaldo", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const calcularAguinaldoHastaHoy = async (): Promise<
    ResultadoCalculoAguinaldoDTO[]
  > => {
    setIsCalculating(true);
    try {
      const resultados = await aguinaldoService.calcularAguinaldoHastaHoy();

      toast.success(
        `Se calcularon ${resultados.length} aguinaldos (hasta hoy)`,
        {
          description: "Revisa los resultados antes de registrar",
        },
      );

      return resultados;
    } catch (error: any) {
      toast.error("Error al calcular aguinaldos hasta hoy", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsCalculating(false);
    }
  };

  const refetch = fetchAguinaldos;

  return {
    aguinaldos,
    resumen,
    isLoading,
    isCalculating,
    isRegistering,
    isPaying,
    isDeleting,
    calcularAguinaldosMasivo,
    registrarAguinaldos,
    pagarAguinaldo,
    pagarAguinaldosMasivo,
    anularAguinaldo,
    calcularAguinaldoHastaHoy,
    refetch,
  };
}
