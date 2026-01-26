/**
 * Estados posibles de una asistencia
 */
export enum EstadoAsistencia {
  PRESENTE = "PRESENTE",
  AUSENTE = "AUSENTE",
  TARDANZA = "TARDANZA",
  JUSTIFICADO = "JUSTIFICADO",
  PERMISO = "PERMISO",
  VACACIONES = "VACACIONES",
  LICENCIA_MEDICA = "LICENCIA_MEDICA",
}

/**
 * Tipos de justificación
 */
export enum TipoJustificacion {
  MEDICA = "MEDICA",
  PERSONAL = "PERSONAL",
  FAMILIAR = "FAMILIAR",
  OTRO = "OTRO",
}

/**
 * Interface base para datos de asistencia
 */
export interface Asistencia {
  id: string;
  empleadoId: string;
  fecha: string; // ISO 8601 format: "2024-01-15"
  horaEntrada: string | null; // "HH:mm:ss" o null
  horaSalida: string | null; // "HH:mm:ss" o null
  estado: EstadoAsistencia;
  observaciones?: string;
  justificacion?: Justificacion;
  horasTrabajadas?: number; // en minutos
  tiempoExtra?: number; // en minutos
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Response del backend (estructura real de la API)
 */
export interface AsistenciaBackend {
  idAsistencia: number;
  empleadoId: number;
  codigoEmpleado: string;
  nombreEmpleado: string;
  fechaRegistro: string; // "2026-01-13T00:00:00"
  horaEntrada: string | null; // "2026-01-13T08:12:00"
  horaSalida: string | null; // "2026-01-13T17:00:00"
  horasTrabajadas: string | null; // "08:48:00"
  estado: EstadoAsistencia;
}

/**
 * Datos de justificación de ausencia
 */
export interface Justificacion {
  tipo: TipoJustificacion;
  descripcion: string;
  documentoUrl?: string; // URL del documento adjunto
  aprobadoPor?: string; // ID del aprobador
  fechaAprobacion?: string;
}

/**
 * Datos del empleado (información básica para asistencia)
 */
export interface EmpleadoAsistencia {
  id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  email: string;
  departamento: string;
  cargo: string;
  avatarUrl?: string;
}

/**
 * Asistencia completa con datos del empleado
 */
export interface AsistenciaDetallada extends Asistencia {
  empleado: EmpleadoAsistencia;
}

/**
 * Payload para crear una nueva asistencia
 * ✅ CORREGIDO: empleadoId ahora acepta string o number
 */
export interface CrearAsistenciaDTO {
  empleadoId: string | number; // ✅ Acepta ambos tipos
  fechaRegistro: string; // ✅ CORREGIDO: era "fecha", ahora "fechaRegistro"
  horaEntrada?: string;
  horaSalida?: string;
  estado: EstadoAsistencia;
  observaciones?: string; // ✅ AGREGADO: campo opcional
}

/**
 * Payload para actualizar asistencia
 */
export interface ActualizarAsistenciaDTO {
  horaEntrada?: string;
  horaSalida?: string;
  estado?: EstadoAsistencia;
  observaciones?: string;
  justificacion?: Justificacion;
}

/**
 * Filtros para consultar asistencias
 */
export interface FiltrosAsistencia {
  empleadoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: EstadoAsistencia[];
  departamento?: string;
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de asistencias
 */
export interface AsistenciasResponse {
  data: AsistenciaDetallada[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Resumen de asistencias por empleado
 */
export interface ResumenAsistencia {
  empleadoId: string;
  empleado: EmpleadoAsistencia;
  periodo: {
    inicio: string;
    fin: string;
  };
  estadisticas: {
    totalDias: number;
    presentes: number;
    ausentes: number;
    tardanzas: number;
    justificados: number;
    permisos: number;
    vacaciones: number;
    licenciasMedicas: number;
  };
  horasTotales: number; // en minutos
  horasExtra: number; // en minutos
  porcentajeAsistencia: number; // 0-100
}

/**
 * Registro rápido de entrada/salida
 */
export interface RegistroAsistencia {
  empleadoId: string;
  tipo: "ENTRADA" | "SALIDA";
  timestamp: string; // ISO 8601
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}

/**
 * Estado del formulario de asistencia
 */
export interface AsistenciaFormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Props comunes para componentes de asistencia
 */
export interface AsistenciaTableProps {
  asistencias: AsistenciaDetallada[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export interface AsistenciaFormProps {
  asistencia?: Asistencia;
  empleados: EmpleadoAsistencia[];
  onSubmit: (
    data: CrearAsistenciaDTO | ActualizarAsistenciaDTO
  ) => Promise<void>;
  onCancel: () => void;
}
