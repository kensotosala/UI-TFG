export interface AguinaldoDTO {
  idAguinaldo: number;
  empleadoId: number;
  codigoEmpleado?: string;
  nombreEmpleado?: string;
  departamento?: string;
  puesto?: string;
  fechaCalculo: string;
  diasTrabajados: number;
  salarioPromedio: number;
  montoAguinaldo: number;
  fechaPago?: string;
  estado?: string;
  anio?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface CalcularAguinaldoDTO {
  empleadoId: number;
  anio: number;
  fechaCorte?: string;
}

export interface CalcularAguinaldoMasivoDTO {
  anio: number;
  fechaCorte?: string;
  departamentoId?: number;
}

export interface ResultadoCalculoAguinaldoDTO {
  empleadoId: number;
  nombreEmpleado: string;
  fechaContratacion: string;
  fechaInicio: string;
  fechaFin: string;
  diasTrabajados: number;
  salarioPromedio: number;
  montoAguinaldo: number;
  detalle: string;
}

export interface ResumenAguinaldoDTO {
  totalEmpleados: number;
  aguinaldosPendientes: number;
  aguinaldosPagados: number;
  totalPendiente: number;
  totalPagado: number;
  totalGeneral: number;
  aguinaldos: AguinaldoDTO[];
}

export interface RegistrarAguinaldosRequest {
  anio: number;
  calculos: ResultadoCalculoAguinaldoDTO[];
}

export interface PagarAguinaldosMasivoRequest {
  idsAguinaldos: number[];
  fechaPago: string;
}
