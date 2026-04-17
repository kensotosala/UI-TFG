/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DetalleNominaDTO,
  GenerarNominaQuincenalDTO,
  NominaDTO,
  NominaParcialDTO,
  PlanillaCCSSDTO,
  ResumenNominaQuincenalDTO,
} from "../nomina.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api";

class NominaService {
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        signal: controller.signal,
      });

      // Manejo de errores HTTP
      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;

        try {
          const error = await response.json();
          errorMessage = error.mensaje || error.message || errorMessage;
        } catch {
          // no body
        }

        throw new Error(errorMessage);
      }

      // Manejo de respuestas sin contenido (204)
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Timeout: El servidor tardó demasiado en responder.");
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // =========================
  // MÉTODOS
  // =========================

  async generarNominaQuincenal(
    data: GenerarNominaQuincenalDTO,
  ): Promise<DetalleNominaDTO[]> {
    return this.fetchWithAuth("/Nomina/generar", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async obtenerNominaPorId(id: number): Promise<NominaDTO> {
    return this.fetchWithAuth(`/Nomina/${id}`);
  }

  async listarNominas(): Promise<NominaDTO[]> {
    return this.fetchWithAuth("/Nomina");
  }

  async obtenerNominasEmpleado(empleadoId: number): Promise<NominaDTO[]> {
    return this.fetchWithAuth(`/Nomina/empleado/${empleadoId}`);
  }

  async obtenerNominasQuincena(
    quincena: number,
    mes: number,
    anio: number,
  ): Promise<NominaDTO[]> {
    return this.fetchWithAuth(
      `/Nomina/quincena/${quincena}/mes/${mes}/anio/${anio}`,
    );
  }

  async anularNomina(id: number): Promise<{ mensaje: string }> {
    return this.fetchWithAuth(`/Nomina/${id}/anular`, {
      method: "PUT",
    });
  }

  async obtenerResumenQuincena(
    quincena: number,
    mes: number,
    anio: number,
  ): Promise<ResumenNominaQuincenalDTO> {
    return this.fetchWithAuth(
      `/Nomina/resumen/quincena/${quincena}/mes/${mes}/anio/${anio}`,
    );
  }

  async generarPlanillaCCSS(
    mes: number,
    anio: number,
  ): Promise<PlanillaCCSSDTO> {
    return this.fetchWithAuth(`/Nomina/reportes/ccss/mes/${mes}/anio/${anio}`);
  }

  async generarDeclaracionD151(mes: number, anio: number): Promise<unknown> {
    return this.fetchWithAuth(`/Nomina/reportes/d151/mes/${mes}/anio/${anio}`);
  }

  async calcularNominaParcialHoy(): Promise<NominaParcialDTO> {
    return this.fetchWithAuth("/Nomina/parcial/hoy");
  }
}

export const nominaService = new NominaService();
