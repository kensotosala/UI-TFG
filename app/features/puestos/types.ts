export type Puesto = {
  idPuesto: number;
  nombrePuesto: string;
  descripcion: string;
  nivelJerarquico: number;
  salarioMinimo: number;
  salarioMaximo: number;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export type UpdatePuestoDto = {
  idPuesto: number;
  nombrePuesto: string;
  descripcion?: string;
  nivelJerarquico?: number;
  salarioMinimo?: number;
  salarioMaximo?: number;
  estado?: boolean;
};
