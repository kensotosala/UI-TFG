export interface Liquidacion {
  id: number;
  empleadoId: number;
  fechaLiquidacion: string;
  MotivoLiquidacion: TipoDespido;
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

export enum EstadoLiquidacion {
  CALCULADA = "CALCULADA",
  ANULADA = "ANULADA",
}

export enum TipoDespido {
  DESPIDO_SIN_CAUSA_JUSTIFICADA = "DESPIDO_SIN_CAUSA_JUSTIFICADA",
  RENUNCIA_VOLUNTARIA = "RENUNCIA_VOLUNTARIA",
  MUTUO_ACUERDO = "MUTUO_ACUERDO",
  DESPIDO_CON_CAUSA_JUSTIFICADA = "DESPIDO_CON_CAUSA_JUSTIFICADA",
}

export interface LiquidacionDTO {
  idLiquidacion: number;
  idEmpleado: number;
  montoPreaviso: number;
  montoVacaciones: number;
  montoAguinaldo: number;
  montoCesantia: number;
  montoTotal: number;
}

export interface CrearLiquidacionDTO {
  empleadoId: number;
  motivoLiquidacion: TipoDespido;
  vacacionesPendientes: number;
  fechaSalida: string;
  preavisoEntregado: boolean;
}

export interface ResultDTO<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}
