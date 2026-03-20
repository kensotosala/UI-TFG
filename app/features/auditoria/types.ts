export type AuditoriaCambios = {
  idAuditoria: number;
  tablaAfectada: string;
  descripcion: string;
  usuarioId: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
};
