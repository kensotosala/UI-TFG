export interface MarcarAsistenciaRequest {
  empleadoId: number;
}

export interface AsistenciaEstado {
  tieneRegistro: boolean;
  horaEntrada?: string;
  horaSalida?: string;
  estado: "PENDIENTE" | "COMPLETO" | "PRESENTE";
  mensaje: string;
}

export interface MarcacionResponse {
  success: boolean;
  message: string;
  data?: {
    horaEntrada?: string;
    horaSalida?: string;
    estado: string;
  };
}
