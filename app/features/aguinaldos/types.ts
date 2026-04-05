export interface AguinaldoDTO {
  idAguinaldo: number;
  empleadoId: number;
  codigoEmpleado?: string;
  nombreEmpleado?: string;
  departamento?: string;
  puesto?: string;
  anio: number;
  fechaCalculo: string;
  diasTrabajados: number;
  salarioPromedio: number;
  montoAguinaldo: number;
  fechaPago?: string;
  estado?: string;
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
}

export type ResultadoCalculoAguinaldoDTO = AguinaldoDTO;

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
  calculos: AguinaldoDTO[];
}

export interface PagarAguinaldosMasivoRequest {
  idsAguinaldos: number[];
  fechaPago: string;
}
