/* eslint-disable @typescript-eslint/no-explicit-any */
// app/features/nomina/services/nomina.service.ts

import {
  DetalleNominaDTO,
  GenerarNominaQuincenalDTO,
  NominaDTO,
  PlanillaCCSSDTO,
  ResumenNominaQuincenalDTO,
} from "../nomina.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api/v1";

class NominaService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ mensaje: "Error desconocido" }));
      throw new Error(error.mensaje || `Error HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Generar nómina quincenal
  async generarNominaQuincenal(
    data: GenerarNominaQuincenalDTO,
  ): Promise<DetalleNominaDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Nomina/generar`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Obtener nómina por ID
  async obtenerNominaPorId(id: number): Promise<NominaDTO> {
    return this.fetchWithAuth(`${API_BASE_URL}/Nomina/${id}`);
  }

  // Listar todas las nóminas
  async listarNominas(): Promise<NominaDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Nomina`);
  }

  // Obtener nóminas de un empleado
  async obtenerNominasEmpleado(empleadoId: number): Promise<NominaDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Nomina/empleado/${empleadoId}`);
  }

  // Obtener nóminas de una quincena
  async obtenerNominasQuincena(
    quincena: number,
    mes: number,
    anio: number,
  ): Promise<NominaDTO[]> {
    return this.fetchWithAuth(
      `${API_BASE_URL}/Nomina/quincena/${quincena}/mes/${mes}/anio/${anio}`,
    );
  }

  // Anular nómina
  async anularNomina(id: number): Promise<{ mensaje: string }> {
    return this.fetchWithAuth(`${API_BASE_URL}/Nomina/${id}/anular`, {
      method: "PUT",
    });
  }

  // Obtener resumen de quincena
  async obtenerResumenQuincena(
    quincena: number,
    mes: number,
    anio: number,
  ): Promise<ResumenNominaQuincenalDTO> {
    return this.fetchWithAuth(
      `${API_BASE_URL}/Nomina/resumen/quincena/${quincena}/mes/${mes}/anio/${anio}`,
    );
  }

  // Generar planilla CCSS
  async generarPlanillaCCSS(
    mes: number,
    anio: number,
  ): Promise<PlanillaCCSSDTO> {
    return this.fetchWithAuth(
      `${API_BASE_URL}/Nomina/reportes/ccss/mes/${mes}/anio/${anio}`,
    );
  }

  // Generar declaración D-151
  async generarDeclaracionD151(mes: number, anio: number): Promise<any> {
    return this.fetchWithAuth(
      `${API_BASE_URL}/Nomina/reportes/d151/mes/${mes}/anio/${anio}`,
    );
  }
}

export const nominaService = new NominaService();
