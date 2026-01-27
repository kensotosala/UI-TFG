// src/types/vacaciones.types.ts

/**
 * ENUMS Y CONSTANTES
 */

/**
 * Estados posibles de una solicitud de vacaciones
 * Corresponde a EstadoSolicitud en el backend
 */
export enum EstadoVacacion {
  PENDIENTE = "PENDIENTE",
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
  CANCELADA = "CANCELADA",
}

/**
 * TIPOS BASE (ENTIDADES)
 */

/**
 * Vacación completa (igual a la entidad del backend)
 * Se usa internamente, pero generalmente trabajamos con DTOs
 */
export interface Vacacion {
  idVacacion: number;
  empleadoId: number;
  fechaSolicitud: string; // ISO 8601 date string
  fechaInicio: string;
  fechaFin: string;
  estadoSolicitud: EstadoVacacion | null;
  jefeApruebaId: number | null;
  fechaAprobacion: string | null;
  comentariosRechazo: string | null;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
}

/**
 * DTOs PARA OPERACIONES CRUD
 */

/**
 * DTO para crear una nueva solicitud de vacaciones (POST)
 * Mapea a CrearVacacionDTO de C#
 */
export interface CrearVacacionDTO {
  empleadoId: number;
  fechaInicio: string; // formato: "YYYY-MM-DD" o ISO 8601
  fechaFin: string;
}

/**
 * DTO para actualizar una solicitud existente (PUT)
 * Mapea a ActualizarVacacionDTO de C#
 */
export interface ActualizarVacacionDTO {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  estadoSolicitud?: string | null;
  fechaAprobacion?: string | null;
  comentariosRechazo?: string | null; // max 1000 caracteres
}

/**
 * DTO para listar vacaciones (GET all)
 * Mapea a ListarVacacionesDTO de C#
 */
export interface ListarVacacionesDTO {
  idVacacion: number;
  empleadoId: number;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  estadoSolicitud: string | null;
  jefeApruebaId: number | null;
  fechaAprobacion: string | null;
  comentariosRechazo: string | null;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
}

/**
 * DTO para obtener una vacación por ID (GET by id)
 * Mapea a ListarVacacionByIdDTO de C#
 * Incluye el campo calculado DiasVacaciones
 */
export interface ListarVacacionByIdDTO extends ListarVacacionesDTO {
  // diasVacaciones se calcula en el backend
  // pero podemos calcularlo también en el frontend si es necesario
  diasVacaciones: number;
}

/**
 * DTOs PARA RESPUESTAS GENÉRICAS
 */

/**
 * DTO genérico para respuestas de la API
 * Mapea a ResultDTO<T> de C#
 */
export interface ResultDTO<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}

/**
 * DTOs PARA SALDOS
 */

/**
 * DTO para mostrar el saldo de vacaciones de un empleado
 * Mapea a SaldoVacacionesDTO de C#
 */
export interface SaldoVacacionesDTO {
  empleadoId: number;
  nombreEmpleado: string;
  anio: number;
  diasAcumulados: number;
  diasDisfrutados: number;
  diasDisponibles: number; // Calculado: diasAcumulados - diasDisfrutados
  diasPendientesAprobacion: number;
  mensaje: string;
}

/**
 * DTOs PARA VALIDACIÓN
 */

/**
 * DTO para resultado de validación de solicitud
 * Mapea a ValidacionVacacionesDTO de C#
 */
export interface ValidacionVacacionesDTO {
  esValida: boolean;
  errores: string[];
  advertencias: string[];
  diasDisponibles: number;
  diasSolicitados: number;
}

/**
 * REQUEST TYPES (para endpoints específicos)
 */

/**
 * Request para rechazar una solicitud
 * Mapea a RechazarVacacionRequest de C#
 */
export interface RechazarVacacionRequest {
  jefeId: number;
  comentarios: string; // max 1000 caracteres
}

/**
 * Request para validar una solicitud sin crearla
 * Mapea a ValidarVacacionRequest de C#
 */
export interface ValidarVacacionRequest {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
}

/**
 * TIPOS AUXILIARES (útiles para el frontend)
 */

/**
 * Tipo para formularios de vacaciones
 * Útil para React Hook Form o Formik
 */
export interface VacacionFormData {
  empleadoId: number | string; // puede venir del form como string
  fechaInicio: Date | string;
  fechaFin: Date | string;
}

/**
 * Tipo para filtros de búsqueda
 */
export interface VacacionesFiltros {
  empleadoId?: number;
  estado?: EstadoVacacion;
  fechaDesde?: string;
  fechaHasta?: string;
  anio?: number;
}

/**
 * Tipo para la respuesta de aprobación/rechazo
 */
export interface VacacionAprobacionResponse {
  exitoso: boolean;
  mensaje: string;
}
