export interface Incapacidad {
  idIncapacidad: number;
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  tipoIncapacidad: TipoIncapacidad;
  diagnostico: string;
  archivoAdjunto?: string;
  estado: EstadoIncapacidad;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface RegistrarIncapacidadDTO {
  diagnostico: string;
  empleadoId: number;
  fechaFin: string;
  fechaInicio: string;
  tipoIncapacidad: string;
}

// DTO de actualización: archivoAdjunto opcional
export interface ActualizarIncapacidadDTO {
  incapacidadId: number;
  diagnostico: string;
  empleadoId: number;
  fechaFin: string;
  fechaInicio: string;
  tipoIncapacidad: string;
  archivoAdjunto?: string;
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
  onCreate: (
    data: Omit<RegistrarIncapacidadDTO, "empleadoId"> & { archivo?: File },
  ) => Promise<void>;
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
} as const;

export type TipoIncapacidad =
  (typeof TIPOS_INCAPACIDAD)[keyof typeof TIPOS_INCAPACIDAD];
export type EstadoIncapacidad =
  (typeof ESTADOS_INCAPACIDAD)[keyof typeof ESTADOS_INCAPACIDAD];
