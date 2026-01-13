// Enums
export enum TipoHoraExtra {
  // NOTA: Estos valores NO se guardan en BD
  // La columna tipo_hora_extra en BD usa valores de estado
  ORDINARIA = "ORDINARIA",
  DOBLE = "DOBLE",
  TRIPLE = "TRIPLE",
}

export enum EstadoSolicitud {
  PENDIENTE = "PENDIENTE",
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
}

// Interfaces principales
export interface HoraExtra {
  idHoraExtra: number;
  empleadoId: number;
  codigoEmpleado: string;
  nombreEmpleado: string;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  horasTotales: number; // En minutos
  tipoHoraExtra: string | null;
  motivo: string;
  estadoSolicitud: string | null;
  jefeApruebaId: number | null;
  nombreJefe: string | null;
  fechaAprobacion: string | null;
  fechaCreacion: string | null;
}

// Backend response (con TimeSpan)
export interface HoraExtraBackend {
  idHoraExtra: number;
  empleadoId: number;
  codigoEmpleado: string;
  nombreEmpleado: string;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  horasTotales: string; // TimeSpan formato "HH:mm:ss"
  tipoHoraExtra: string | null;
  motivo: string;
  estadoSolicitud: string | null;
  jefeApruebaId: number | null;
  nombreJefe: string | null;
  fechaAprobacion: string | null;
  fechaCreacion: string | null;
}

// DTOs
export interface CrearHoraExtraDTO {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  tipoHoraExtra?: string; // Opcional - no se usa en BD pero lo enviamos por compatibilidad
  motivo: string;
  jefeApruebaId?: number;
}

export interface ActualizarHoraExtraDTO {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  tipoHoraExtra?: string; // Opcional - no se usa en BD
  motivo: string;
  estadoSolicitud?: string;
  jefeApruebaId?: number;
}

export interface AprobarRechazarHoraExtraDTO {
  jefeApruebaId: number;
  estadoSolicitud: EstadoSolicitud;
}

export interface FiltrosHorasExtras {
  empleadoId?: number;
  departamentoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estadoSolicitud?: string;
  jefeApruebaId?: number;
}

export interface ReporteHorasExtras {
  empleadoId: number;
  nombreCompleto: string;
  departamento: string;
  totalSolicitudes: number;
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  solicitudesRechazadas: number;
  totalHorasAprobadas: string;
  totalHorasSolicitadas: string;
}
