export interface Incapacidad {
  archivoAdjunto: string;
  diagnostico: string;
  empleadoId: number;
  estado: string;
  fechaCreacion: string;
  fechaFin: string;
  fechaInicio: string;
  fechaModificacion: string;
  idIncapacidad: number;
  tipoIncapacidad: string;
}

export interface RegistrarIncapacidadDTO {
  archivoAdjunto: string | null;
  diagnostico: string;
  empleadoId: number;
  fechaFin: string;
  fechaInicio: string;
  tipoIncapacidad: string;
}

export interface ActualizarIncapacidadDTO {
  archivoAdjunto: string;
  diagnostico: string;
  empleadoId: number;
  fechaFin: string;
  fechaInicio: string;
  incapacidadId: number;
  tipoIncapacidad: string;
}

export interface IncapacidadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incapacidad: Incapacidad | null;
}

export interface IncapacidadDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incapacidad: Incapacidad | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

export interface IncapacidadCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: RegistrarIncapacidadDTO) => Promise<void>;
}

export interface IncapacidadUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incapacidad: Incapacidad | null;
  onUpdate: (data: ActualizarIncapacidadDTO) => Promise<void>;
}

export const TIPOS_INCAPACIDAD = {
  ENFERMEDAD: "ENFERMEDAD",
  ACCIDENTE: "ACCIDENTE",
  MATERNIDAD: "MATERNIDAD",
  PATERNIDAD: "PATERNIDAD",
} as const;

export const ESTADOS_INCAPACIDAD = {
  ACTIVA: "ACTIVA",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
} as const;

export type TipoIncapacidad =
  (typeof TIPOS_INCAPACIDAD)[keyof typeof TIPOS_INCAPACIDAD];
export type EstadoIncapacidad =
  (typeof ESTADOS_INCAPACIDAD)[keyof typeof ESTADOS_INCAPACIDAD];
