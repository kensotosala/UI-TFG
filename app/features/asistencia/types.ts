export interface MarcarAsistenciaRequest {
  empleadoId: number;
}

export interface AsistenciaEstado {
  tieneRegistro: boolean;
  horaEntrada?: string;
  horaSalida?: string;
  estado: "SIN_REGISTRO" | "ENTRADA_REGISTRADA" | "COMPLETO";
  puedeMarcarEntrada: boolean;
  puedeMarcarSalida: boolean;
  mensaje: string;
}

export interface MarcacionResponse {
  success: boolean;
  message: string;
  data?: {
    accion: string;
    hora: string;
    mensaje: string;
    horaEntrada?: string;
    horaSalida?: string;
    estado?: string;
    exito: boolean;
  };
}
