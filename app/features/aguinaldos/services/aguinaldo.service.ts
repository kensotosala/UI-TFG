import {
  AguinaldoDTO,
  CalcularAguinaldoDTO,
  CalcularAguinaldoMasivoDTO,
  ResultadoCalculoAguinaldoDTO,
  ResumenAguinaldoDTO,
  RegistrarAguinaldosRequest,
  PagarAguinaldosMasivoRequest,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api/v1";

class AguinaldoService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken");

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
      throw new Error(
        error.mensaje || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.datos || data;
  }

  // ==================== CONSULTAS ====================

  async obtenerTodos(): Promise<AguinaldoDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo`);
  }

  async obtenerPorId(id: number): Promise<AguinaldoDTO> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/${id}`);
  }

  async obtenerPorAnio(anio: number): Promise<AguinaldoDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/anio/${anio}`);
  }

  async obtenerPorEmpleado(empleadoId: number): Promise<AguinaldoDTO[]> {
    return this.fetchWithAuth(
      `${API_BASE_URL}/Aguinaldo/empleado/${empleadoId}`,
    );
  }

  async obtenerResumen(anio: number): Promise<ResumenAguinaldoDTO> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/resumen/${anio}`);
  }

  // ==================== CÁLCULO ====================

  async calcularAguinaldo(
    dto: CalcularAguinaldoDTO,
  ): Promise<ResultadoCalculoAguinaldoDTO> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/calcular`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async calcularAguinaldoMasivo(
    dto: CalcularAguinaldoMasivoDTO,
  ): Promise<ResultadoCalculoAguinaldoDTO[]> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/calcular-masivo-v2`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async calcularAguinaldoHastaHoy(): Promise<ResultadoCalculoAguinaldoDTO[]> {
    const response = await fetch(
      `${API_BASE_URL}/Aguinaldo/calcular-hasta-hoy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ mensaje: "Error desconocido" }));

      throw new Error(
        error.mensaje || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    // { registrados: [...], errores: [] }
    if (Array.isArray(data.registrados)) return data.registrados;

    // Fallbacks por si el contrato cambia
    if (Array.isArray(data.datos)) return data.datos;
    if (Array.isArray(data)) return data;

    throw new Error("La respuesta del servidor no contiene un array válido");
  }

  // ==================== REGISTRO ====================

  async registrarAguinaldos(request: RegistrarAguinaldosRequest): Promise<{
    exitosos: number;
    fallidos: number;
    datos: AguinaldoDTO[];
    errores: string[];
  }> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/registrar`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // ==================== PAGO ====================

  async pagarAguinaldo(id: number, fechaPago: string): Promise<void> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/${id}/pagar`, {
      method: "PUT",
      body: JSON.stringify({ idAguinaldo: id, fechaPago }),
    });
  }

  async pagarAguinaldosMasivo(request: PagarAguinaldosMasivoRequest): Promise<{
    exitosos: number;
    fallidos: number;
    errores: string[];
  }> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/pagar-masivo`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // ==================== ANULAR ====================

  async anularAguinaldo(id: number): Promise<void> {
    return this.fetchWithAuth(`${API_BASE_URL}/Aguinaldo/${id}`, {
      method: "DELETE",
    });
  }
}

export const aguinaldoService = new AguinaldoService();
