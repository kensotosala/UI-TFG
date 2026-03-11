import ApiClient from "@/lib/api/client";
import type {
  ApiResult,
  CreateEvaluacionDto,
  EvaluacionRendimientoResponse,
  UpdateEvaluacionDto,
} from "../types";

const BASE_URL = "/v1/EvaluacionesRendimiento";

// Get the axios instance once
const apiClient = ApiClient.getInstance();

export const evaluacionesRendimientoService = {
  /**
   * GET /api/v1/EvaluacionesRendimiento
   * Retorna todas las evaluaciones de rendimiento.
   */
  getAll: async (): Promise<ApiResult<EvaluacionRendimientoResponse[]>> => {
    const response =
      await apiClient.get<ApiResult<EvaluacionRendimientoResponse[]>>(BASE_URL);
    return response.data;
  },

  /**
   * GET /api/v1/EvaluacionesRendimiento/:id
   * Retorna una evaluación por su ID.
   */
  getById: async (
    id: number,
  ): Promise<ApiResult<EvaluacionRendimientoResponse>> => {
    const response = await apiClient.get<
      ApiResult<EvaluacionRendimientoResponse>
    >(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * POST /api/v1/EvaluacionesRendimiento
   * Crea una nueva evaluación con sus detalles.
   */
  create: async (
    data: CreateEvaluacionDto,
  ): Promise<ApiResult<EvaluacionRendimientoResponse>> => {
    const response = await apiClient.post<
      ApiResult<EvaluacionRendimientoResponse>
    >(BASE_URL, data);
    return response.data;
  },

  /**
   * PUT /api/v1/EvaluacionesRendimiento/:id
   * Actualiza cabecera y hace merge de detalles (crear/actualizar/eliminar).
   */
  update: async (
    id: number,
    data: UpdateEvaluacionDto,
  ): Promise<ApiResult<EvaluacionRendimientoResponse>> => {
    const response = await apiClient.put<
      ApiResult<EvaluacionRendimientoResponse>
    >(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/v1/EvaluacionesRendimiento/:id
   * Soft-delete: cambia el estado a "ANULADA".
   */
  delete: async (id: number): Promise<ApiResult<boolean>> => {
    const response = await apiClient.delete<ApiResult<boolean>>(
      `${BASE_URL}/${id}`,
    );
    return response.data;
  },

  // evaluaciones-rendimiento.service.ts
  // Agregar al objeto evaluacionesRendimientoService:

  /**
   * PATCH /api/v1/EvaluacionesRendimiento/aprobar/:id
   * Cambia el estado de la evaluación a "APROBADA".
   */
  aprobar: async (id: number): Promise<ApiResult<boolean>> => {
    const response = await apiClient.patch<ApiResult<boolean>>(
      `${BASE_URL}/aprobar/${id}`,
    );
    return response.data;
  },
};
