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

/**
 * Servicio para gestionar las solicitudes de vacaciones
 */
class VacacionesService {
  private readonly basePath = "/Vacaciones";

  // ========================================
  // HELPER PARA DESENVOLVER RESPUESTAS
  // ========================================
  private async unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
    const { data } = await promise;
    return data;
  }

  // ========================================
  // CRUD
  // ========================================

  async crearSolicitud(
    dto: CrearVacacionDTO,
  ): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    return this.unwrap(
      api.post<ResultDTO<ListarVacacionByIdDTO>>(this.basePath, dto),
    );
  }

  async actualizarSolicitud(
    id: number,
    dto: ActualizarVacacionDTO,
  ): Promise<ResultDTO<boolean>> {
    return this.unwrap(
      api.put<ResultDTO<boolean>>(`${this.basePath}/${id}`, dto),
    );
  }

  async cancelarSolicitud(id: number): Promise<ResultDTO<boolean>> {
    return this.unwrap(
      api.delete<ResultDTO<boolean>>(`${this.basePath}/${id}`),
    );
  }

  async obtenerPorId(id: number): Promise<ResultDTO<ListarVacacionByIdDTO>> {
    return this.unwrap(
      api.get<ResultDTO<ListarVacacionByIdDTO>>(`${this.basePath}/${id}`),
    );
  }

  async obtenerTodas(): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    return this.unwrap(
      api.get<ResultDTO<ListarVacacionesDTO[]>>(this.basePath),
    );
  }

  async obtenerPorEmpleado(
    empleadoId: number,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    return this.unwrap(
      api.get<ResultDTO<ListarVacacionesDTO[]>>(
        `${this.basePath}/empleado/${empleadoId}`,
      ),
    );
  }

  async obtenerPorEstado(
    estado: string,
  ): Promise<ResultDTO<ListarVacacionesDTO[]>> {
    return this.unwrap(
      api.get<ResultDTO<ListarVacacionesDTO[]>>(
        `${this.basePath}/estado/${estado}`,
      ),
    );
  }

  // ========================================
  // APROBACIÓN / RECHAZO
  // ========================================

  async aprobarSolicitud(
    id: number,
    jefeId: number,
  ): Promise<ResultDTO<boolean>> {
    return this.unwrap(
      api.patch<ResultDTO<boolean>>(
        `${this.basePath}/${id}/aprobar`,
        undefined,
        {
          params: { jefeId },
        },
      ),
    );
  }

  async rechazarSolicitud(
    id: number,
    request: RechazarVacacionRequest,
  ): Promise<ResultDTO<boolean>> {
    return this.unwrap(
      api.patch<ResultDTO<boolean>>(`${this.basePath}/${id}/rechazar`, request),
    );
  }

  // ========================================
  // SALDOS
  // ========================================

  async obtenerSaldo(
    empleadoId: number,
    anio?: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    return this.unwrap(
      api.get<ResultDTO<SaldoVacacionesDTO>>(
        `${this.basePath}/saldo/${empleadoId}`,
        {
          params: { anio },
        },
      ),
    );
  }

  async obtenerHistorialSaldos(
    empleadoId: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO[]>> {
    return this.unwrap(
      api.get<ResultDTO<SaldoVacacionesDTO[]>>(
        `${this.basePath}/saldo/${empleadoId}/historial`,
      ),
    );
  }

  async recalcularSaldo(
    empleadoId: number,
    anio: number,
  ): Promise<ResultDTO<SaldoVacacionesDTO>> {
    return this.unwrap(
      api.post<ResultDTO<SaldoVacacionesDTO>>(
        `${this.basePath}/saldo/${empleadoId}/recalcular`,
        undefined,
        {
          params: { anio },
        },
      ),
    );
  }

  // ========================================
  // VALIDACIÓN
  // ========================================

  async validarSolicitud(
    request: ValidarVacacionRequest,
  ): Promise<ResultDTO<ValidacionVacacionesDTO>> {
    return this.unwrap(
      api.post<ResultDTO<ValidacionVacacionesDTO>>(
        `${this.basePath}/validar`,
        request,
      ),
    );
  }

  // ========================================
  // HELPERS FRONTEND
  // ========================================

  calcularDias(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio + "T00:00:00");
    const fin = new Date(fechaFin + "T00:00:00");

    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;

    return dias > 0 ? dias : 0;
  }

  formatearFecha(fecha: Date | string): string {
    const date = typeof fecha === "string" ? new Date(fecha) : fecha;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

// Singleton
export const vacacionesService = new VacacionesService();
export default vacacionesService;
