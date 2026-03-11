import { evaluacionesRendimientoService } from "../services/evaluaciones-rendimiento.service";

//  Query Keys

export const evaluacionesRendimientoKeys = {
  /** Base key para toda la feature */
  all: ["evaluaciones-rendimiento"] as const,

  /** Lista completa */
  lists: () => [...evaluacionesRendimientoKeys.all, "list"] as const,

  /** Detalle de una evaluación específica */
  detail: (id: number) =>
    [...evaluacionesRendimientoKeys.all, "detail", id] as const,
};

//  Query Functions

/**
 * Función de fetching para la lista de evaluaciones.
 * Usada por React Query como queryFn.
 */
export const fetchEvaluacionesRendimiento = async () => {
  const result = await evaluacionesRendimientoService.getAll();
  if (!result.exitoso || !result.datos) {
    throw new Error(result.mensaje ?? "Error al obtener las evaluaciones.");
  }
  return result.datos;
};

/**
 * Función de fetching para una evaluación por ID.
 * Lanza error si no se encuentra o el backend reporta fallo.
 */
export const fetchEvaluacionRendimientoById = async (id: number) => {
  const result = await evaluacionesRendimientoService.getById(id);
  if (!result.exitoso || !result.datos) {
    throw new Error(
      result.mensaje ?? `No se encontró la evaluación con ID ${id}.`,
    );
  }
  return result.datos;
};

export const aprobarEvaluacionRendimiento = async (
  id: number,
): Promise<boolean> => {
  const result = await evaluacionesRendimientoService.aprobar(id);
  if (!result.exitoso) {
    throw new Error(result.mensaje ?? `Error al aprobar la evaluación ${id}.`);
  }
  return result.datos ?? false;
};
