//  Enums

export const ESTADOS_EVALUACION = ["PENDIENTE", "ANULADA", "APROBADA"] as const;
export type EstadoEvaluacion = (typeof ESTADOS_EVALUACION)[number];

//  Response DTOs

export interface DetalleEvaluacionResponse {
  idDetalle: number;
  idEvaluacion: number;
  idMetrica: number;
  nombreMetrica: string;
  puntuacion: number; // 0–100
  comentarios: string | null;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface EvaluacionRendimientoResponse {
  idEvaluacion: number;
  empleadoId: number;
  nombreEmpleado: string;
  fechaInicio: string;
  fechaFin: string;
  evaluadorId: number;
  nombreEvaluador: string;
  puntuacionTotal: number;
  comentarios: string | null;
  estado: EstadoEvaluacion;
  fechaCreacion: string;
  fechaModificacion: string;
  detalles: DetalleEvaluacionResponse[];
}

//  API Wrapper

export interface ApiResult<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}

//  Create DTOs

export interface CreateDetalleEvaluacionDto {
  idMetrica: number;
  puntuacion: number;
  comentarios?: string;
}

export interface CreateEvaluacionDto {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  evaluadorId: number;
  comentarios?: string;
  detalles: CreateDetalleEvaluacionDto[];
}

// Update DTOs

export interface UpdateDetalleEvaluacionDto {
  idDetalle: number;
  idMetrica: number;
  puntuacion: number;
  comentarios?: string;
}

export interface UpdateEvaluacionDto {
  idEvaluacion: number;
  fechaInicio: string;
  fechaFin: string;
  evaluadorId: number;
  comentarios?: string;
  estado: EstadoEvaluacion;
  detalles: UpdateDetalleEvaluacionDto[];
}

// Form Values (internal, no IDs de BD)

export interface DetalleFormValues {
  idDetalle: number;
  idMetrica: number;
  puntuacion: number;
  comentarios: string;
}

export interface CreateEvaluacionFormValues {
  empleadoId: number;
  evaluadorId: number;
  fechaInicio: string;
  fechaFin: string;
  comentarios: string;
  estado: EstadoEvaluacion;
  detalles: DetalleFormValues[];
}

export type UpdateEvaluacionFormValues = CreateEvaluacionFormValues & {
  idEvaluacion: number;
};

export interface MetricasRendimientoDTO {
  idMetrica: number;
  nombreMetrica: string;
}

export interface ResultDTO<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T;
  errores: string[];
}
