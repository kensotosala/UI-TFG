import api from "@/lib/axios-config";

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

class VacacionesService {
  private readonly basePath = "/Vacaciones";

  // ========================================
  // CRUD
  // ========================================

  async crearSolicitud(
    dto: CrearVacacionDTO,
  ): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    const { data } = await api.post<ResultDTO<ListarVacacionByIdDTO>>(
      this.basePath,
      dto,
    );
    return data;
  }

  async actualizarSolicitud(
    id: number,
    dto: ActualizarVacacionDTO,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await api.put<ResultDTO<boolean>>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  async cancelarSolicitud(id: number): Promise<ResultDTO<boolean>> {
    const { data } = await api.delete<ResultDTO<boolean>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async obtenerPorId(id: number): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    const { data } = await api.get<ResultDTO<ListarVacacionByIdDTO>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async obtenerTodas(): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await api.get<ResultDTO<ListarVacacionesDTO[]>>(
      this.basePath,
    );
    return data;
  }

  async obtenerPorEmpleado(
    empleadoId: number,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await api.get<ResultDTO<ListarVacacionesDTO[]>>(
      `${this.basePath}/empleado/${empleadoId}`,
    );
    return data;
  }

  async obtenerPorEstado(
    estado: string,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    const { data } = await api.get<ResultDTO<ListarVacacionesDTO[]>>(
      `${this.basePath}/estado/${estado}`,
    );
    return data;
  }

  // ========================================
  // APROBACIÓN
  // ========================================

  async aprobarSolicitud(
    id: number,
    jefeId: number,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await api.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/aprobar`,
      null,
      {
        params: { jefeId },
      },
    );
    return data;
  }

  async rechazarSolicitud(
    id: number,
    request: RechazarVacacionRequest,
  ): Promise<ResultDTO<boolean>> {
    const { data } = await api.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/rechazar`,
      request,
    );
    return data;
  }

  // ========================================
  // SALDOS
  // ========================================

  async obtenerSaldo(
    empleadoId: number,
    anio?: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    const { data } = await api.get<ResultDTO<SaldoVacacionesDTO>>(
      `${this.basePath}/saldo/${empleadoId}`,
      {
        params: anio ? { anio } : undefined, // ✅ FIX limpio
      },
    );
    return data;
  }

  async obtenerHistorialSaldos(
    empleadoId: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO[]>> {
    const { data } = await api.get<ResultDTO<SaldoVacacionesDTO[]>>(
      `${this.basePath}/saldo/${empleadoId}/historial`,
    );
    return data;
  }

  async recalcularSaldo(
    empleadoId: number,
    anio: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    const { data } = await api.post<ResultDTO<SaldoVacacionesDTO>>(
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

  async validarSolicitud(
    request: ValidarVacacionRequest,
  ): Promise<ResultDTO<ValidacionVacacionesDTO>> {
    const { data } = await api.post<ResultDTO<ValidacionVacacionesDTO>>(
      `${this.basePath}/validar`,
      request,
    );
    return data;
  }

  // ========================================
  // HELPERS (sin cambios)
  // ========================================

  calcularDias(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
    return dias > 0 ? dias : 0;
  }

  formatearFecha(fecha: Date | string): string {
    const date = typeof fecha === "string" ? new Date(fecha) : fecha;
    return date.toISOString().split("T")[0]; // ✅ más limpio
  }

  esPendiente(vacacion: ListarVacacionesDTO): boolean {
    return vacacion.estadoSolicitud === "PENDIENTE";
  }

  estaAprobada(vacacion: ListarVacacionesDTO): boolean {
    return vacacion.estadoSolicitud === "APROBADA";
  }

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

export const vacacionesService = new VacacionesService();
export default vacacionesService;
