export enum EstadoLiquidacion {
  CALCULADA = "CALCULADA",
  ANULADA = "ANULADA",
}

export enum TipoDespido {
  RENUNCIA_RESPONSABILIDAD_PATRONAL = "RENUNCIA_RESPONSABILIDAD_PATRONAL",
  DESPIDO_RESPONSABILIDAD_PATRONAL = "DESPIDO_RESPONSABILIDAD_PATRONAL",
  DESPIDO_SIN_RESPONSABILIDAD = "DESPIDO_SIN_RESPONSABILIDAD",
  RENUNCIA = "RENUNCIA",
  JUBILACION = "JUBILACION",
}
export interface LiquidacionDTO {
  idLiquidacion: number;
  idEmpleado: number;
  montoPreaviso: number;
  montoVacaciones: number;
  montoAguinaldo: number;
  montoCesantia: number;
  montoTotal?: number;
  estado: EstadoLiquidacion;
}

export interface CrearLiquidacionDTO {
  empleadoId: number;
  fechaSalida: string;
  motivoLiquidacion: TipoDespido;
  preavisoEntregado: boolean;
}

export interface EditarLiquidacionDTO {
  id: number;
  montoPreaviso: number;
  montoVacaciones: number;
  montoAguinaldo: number;
  montoCesantia: number;
}

export interface ResultDTO<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}

export interface Liquidacion {
  id: number;
  empleadoId: number;
  fechaLiquidacion: string;
  motivoLiquidacion: TipoDespido;
  salarioBase: number;
  vacacionesPendientes: number;
  aguinaldoProporcional: number;
  indemnizacion: number;
  otrosConceptos: number;
  totalLiquidacion: number;
  estado: EstadoLiquidacion;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export const getMontoTotal = (l: LiquidacionDTO): number =>
  l.montoTotal ??
  l.montoPreaviso + l.montoVacaciones + l.montoAguinaldo + l.montoCesantia;
