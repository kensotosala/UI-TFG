// src/services/vacaciones.service.ts

import { AxiosInstance } from "axios";
import ApiClient from "@/lib/api/client";
import {
  ActualizarVacacionDTO,
  CrearVacacionDTO,
  ListarVacacionByIdDTO,
  ListarVacacionesDTO,
  RechazarVacacionRequest,
  ResultDTO,
  SaldoVacacionesDTO,
  ValidacionVacacionesDTO,
  ValidarVacacionRequest,
} from "../vacaciones.types";

/**
 * Servicio para gestionar las solicitudes de vacaciones
 * Implementa todos los endpoints del VacacionesController
 */
class VacacionesService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/v1/Vacaciones";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  // ========================================
  // OPERACIONES CRUD BÁSICAS
  // ========================================

  /**
   * Crea una nueva solicitud de vacaciones
   * POST /api/v1/Vacaciones
   */
  async crearSolicitud(
    dto: CrearVacacionDTO,
  ): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    // ✅ CORRECCIÓN: Agregar el símbolo < antes del generic
    const { data } = await this.apiClient.post<
      ResultDTO<ListarVacacionByIdDTO>
    >(this.basePath, dto);
    return data;
  }

  /**
   * Actualiza una solicitud de vacaciones existente
   * PUT /api/v1/Vacaciones/{id}
   */
  async actualizarSolicitud(
    id: number,
    dto: ActualizarVacacionDTO,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await this.apiClient.put<ResultDTO<boolean>>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  /**
   * Cancela (elimina lógicamente) una solicitud de vacaciones
   * DELETE /api/v1/Vacaciones/{id}
   */
  async cancelarSolicitud(id: number): Promise<ResultDTO<boolean>> {
    const { data } = await this.apiClient.delete<ResultDTO<boolean>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  /**
   * Obtiene una solicitud de vacaciones por su ID
   * GET /api/v1/Vacaciones/{id}
   */
  async obtenerPorId(id: number): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    const { data } = await this.apiClient.get<ResultDTO<ListarVacacionByIdDTO>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  /**
   * Obtiene todas las solicitudes de vacaciones
   * GET /api/v1/Vacaciones
   */
  async obtenerTodas(): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await this.apiClient.get<ResultDTO<ListarVacacionesDTO[]>>(
      this.basePath,
    );
    return data;
  }

  /**
   * Obtiene las solicitudes de un empleado específico
   * GET /api/v1/Vacaciones/empleado/{empleadoId}
   */
  async obtenerPorEmpleado(
    empleadoId: number,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await this.apiClient.get<ResultDTO<ListarVacacionesDTO[]>>(
      `${this.basePath}/empleado/${empleadoId}`,
    );
    return data;
  }

  /**
   * Obtiene solicitudes filtradas por estado
   * GET /api/v1/Vacaciones/estado/{estado}
   */
  async obtenerPorEstado(
    estado: string,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await this.apiClient.get<ResultDTO<ListarVacacionesDTO[]>>(
      `${this.basePath}/estado/${estado}`,
    );
    return data;
  }

  // ========================================
  // APROBACIÓN Y RECHAZO
  // ========================================

  /**
   * Aprueba una solicitud de vacaciones
   * PATCH /api/v1/Vacaciones/{id}/aprobar?jefeId={jefeId}
   */
  async aprobarSolicitud(
    id: number,
    jefeId: number,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await this.apiClient.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/aprobar`,
      null, // No body
      {
        params: { jefeId }, // Query parameter
      },
    );
    return data;
  }

  /**
   * Rechaza una solicitud de vacaciones
   * PATCH /api/v1/Vacaciones/{id}/rechazar
   */
  async rechazarSolicitud(
    id: number,
    request: RechazarVacacionRequest,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await this.apiClient.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/rechazar`,
      request,
    );
    return data;
  }

  // ========================================
  // SALDOS
  // ========================================

  /**
   * Obtiene el saldo de vacaciones de un empleado para un año
   * GET /api/v1/Vacaciones/saldo/{empleadoId}?anio={anio}
   */
  async obtenerSaldo(
    empleadoId: number,
    anio?: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    const { data } = await this.apiClient.get<ResultDTO<SaldoVacacionesDTO>>(
      `${this.basePath}/saldo/${empleadoId}`,
      {
        params: { anio },
      },
    );
    return data;
  }

  /**
   * Obtiene el historial de saldos de un empleado (todos los años)
   * GET /api/v1/Vacaciones/saldo/{empleadoId}/historial
   */
  async obtenerHistorialSaldos(
    empleadoId: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO[]>> {
    const { data } = await this.apiClient.get<ResultDTO<SaldoVacacionesDTO[]>>(
      `${this.basePath}/saldo/${empleadoId}/historial`,
    );
    return data;
  }

  /**
   * Recalcula el saldo de vacaciones de un empleado
   * POST /api/v1/Vacaciones/saldo/{empleadoId}/recalcular?anio={anio}
   */
  async recalcularSaldo(
    empleadoId: number,
    anio: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    const { data } = await this.apiClient.post<ResultDTO<SaldoVacacionesDTO>>(
      `${this.basePath}/saldo/${empleadoId}/recalcular`,
      null,
      {
        params: { anio },
      },
    );
    return data;
  }

  // ========================================
  // VALIDACIÓN
  // ========================================

  /**
   * Valida si un empleado puede solicitar vacaciones en un rango de fechas
   * Sin crear la solicitud, solo valida
   * POST /api/v1/Vacaciones/validar
   */
  async validarSolicitud(
    request: ValidarVacacionRequest,
  ): Promise<ResultDTO<ValidacionVacacionesDTO>> {
    const { data } = await this.apiClient.post<
      ResultDTO<ValidacionVacacionesDTO>
    >(`${this.basePath}/validar`, request);
    return data;
  }

  // ========================================
  // MÉTODOS AUXILIARES (HELPERS)
  // ========================================

  /**
   * Calcula los días de vacaciones entre dos fechas (frontend)
   * Útil para mostrar al usuario antes de enviar la solicitud
   */
  calcularDias(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
    return dias > 0 ? dias : 0;
  }

  /**
   * Formatea una fecha para enviar a la API
   */
  formatearFecha(fecha: Date | string): string {
    const date = typeof fecha === "string" ? new Date(fecha) : fecha;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Verifica si una solicitud está en estado pendiente
   */
  esPendiente(vacacion: ListarVacacionesDTO): boolean {
    return vacacion.estadoSolicitud === "PENDIENTE";
  }

  /**
   * Verifica si una solicitud está aprobada
   */
  estaAprobada(vacacion: ListarVacacionesDTO): boolean {
    return vacacion.estadoSolicitud === "APROBADA";
  }

  /**
   * Obtiene el color del badge según el estado
   * Útil para componentes UI
   */
  obtenerColorEstado(estado: string | null): string {
    switch (estado) {
      case "PENDIENTE":
        return "yellow";
      case "APROBADA":
        return "green";
      case "RECHAZADA":
        return "red";
      case "CANCELADA":
        return "gray";
      default:
        return "gray";
    }
  }
}

// Exportar instancia singleton
export const vacacionesService = new VacacionesService();
export default vacacionesService;
