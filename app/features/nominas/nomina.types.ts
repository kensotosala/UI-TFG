export interface NominaDTO {
  idNomina: number;
  empleadoId: number;
  periodoNomina: string;
  fechaPago: string;
  salarioBase: number;
  horasExtras?: number;
  montoHorasExtra?: number;
  bonificaciones?: number;
  deducciones?: number;
  totalBruto: number;
  totalNeto: number;
  estado?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  nombreEmpleado?: string;
  codigoEmpleado?: string;
  puesto?: string;
  departamento?: string;
}

export interface DetalleNominaDTO {
  empleadoId: number;
  codigoEmpleado: string;
  nombreCompleto: string;
  puesto: string;
  departamento: string;
  salarioBaseQuincenal: number;
  horasExtraDiurnas: number;
  horasExtraNocturnas: number;
  horasExtraFeriados: number;
  totalHorasExtra: number;
  bonificaciones: number;
  totalBruto: number;
  deduccionesCCSS: DeduccionesCCSSDTO;
  totalCCSS: number;
  impuestoRenta: ImpuestoRentaDTO;
  pensionAlimenticia: number;
  prestamos: number;
  embargos: number;
  otrasDeducciones: number;
  totalDeducciones: number;
  ajustesAusencias: AjustesAusenciasDTO;
  totalNeto: number;
}

export interface DeduccionesCCSSDTO {
  sem: number;
  ivm: number;
  bancoPopular: number;
  anp: number;
  total: number;
}

export interface ImpuestoRentaDTO {
  baseImponible: number;
  proyeccionMensual: number;
  impuestoMensual: number;
  impuestoQuincenal: number;
  tramoAplicado: string;
}

export interface AjustesAusenciasDTO {
  diasIncapacidad: number;
  montoIncapacidad: number;
  diasPermisoSinGoce: number;
  montoPermisoSinGoce: number;
  diasVacaciones: number;
  montoVacaciones: number;
  totalAjustes: number;
}

export interface GenerarNominaQuincenalDTO {
  quincena: 1 | 2;
  mes: number;
  anio: number;
  fechaPago: string;
  empleadosIds?: number[];
}

export interface ResumenNominaQuincenalDTO {
  quincena: number;
  mes: number;
  anio: number;
  totalEmpleados: number;
  totalBruto: number;
  totalCCSS: number;
  totalImpuestoRenta: number;
  totalDeducciones: number;
  totalNeto: number;
  fechaGeneracion: string;
  estado: string;
}

export interface PlanillaCCSSDTO {
  mes: number;
  anio: number;
  empleados: DetalleCCSSEmpleadoDTO[];
  totalSalariosReportados: number;
  totalCuotaObrera: number;
  totalCuotaPatronal: number;
}

export interface DetalleCCSSEmpleadoDTO {
  cedula: string;
  nombreCompleto: string;
  salarioReportado: number;
  cuotaObrera: number;
  cuotaPatronal: number;
}

export type EstadoNomina = "PENDIENTE" | "PAGADA" | "ANULADA";

export interface DetalleNominaParcialEmpleado {
  empleadoId: number;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  puesto: string;
  salarioBaseQuincenal: number;
  salarioProporcional: number;
  totalHorasExtra: number;
  bonificaciones: number;
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
  porcentajeCompletado: number;
}

export interface NominaParcialDTO {
  quincena: number;
  inicioQuincena: string;
  fechaCalculo: string;
  diasTranscurridos: number;
  diasTotalesQuincena: number;
  porcentajeCompletado: number;
  empleados: DetalleNominaParcialEmpleado[];
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
}
