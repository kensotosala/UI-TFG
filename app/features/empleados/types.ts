export type TipoContrato = "FIJO" | "TEMPORAL" | "PRACTICAS";
export type EstadoEmpleado = "ACTIVO" | "INACTIVO";

export interface Empleado {
  idEmpleado: number;
  codigoEmpleado: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  telefono: string;
  fechaContratacion: string;
  puestoId: number;
  departamentoId: number;
  jefeInmediatoId?: number;
  salarioBase: number;
  tipoContrato: TipoContrato;
  estado?: EstadoEmpleado;
  nombreUsuario?: string;
  password?: string;
  rolId: number;
}

export interface EmpleadoCreateDTO {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  telefono: string;
  fechaContratacion: string;
  puestoId: number;
  departamentoId: number;
  jefeInmediatoId?: number;
  salarioBase: number;
  tipoContrato: "FIJO" | "TEMPORAL" | "PRACTICAS";
  nombreUsuario: string;
  password: string;
  rolId: number;
}

export interface UsuarioDTO {
  idUsuario: number;
  empleadoId: number;
  nombreUsuario: string;
  estado?: string | null;
  ultimoAcceso?: Date | null;
  fechaCreacion?: Date | null;
  nombreEmpleado?: string | null;
}
