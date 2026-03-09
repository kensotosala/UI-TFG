import ApiClient from "@/lib/api/client";
import {
  CrearLiquidacionDTO,
  EditarLiquidacionDTO,
  LiquidacionDTO,
  ResultDTO,
} from "../types";
import { AxiosInstance } from "axios";

class LiquidacionesService {
  private apiClient: AxiosInstance;
  private readonly basePath = "/v1/Liquidaciones";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  // ========================================
  // OPERACIONES CRUD BÁSICAS
  // ========================================

  /**
   * Listar las liquidaciones
   */
  async listar(): Promise<ResultDTO<LiquidacionDTO[]>> {
    const { data } = await this.apiClient.get<ResultDTO<LiquidacionDTO[]>>(
      this.basePath,
    );
    return data;
  }

  /**
   * Crear una nueva liquidación
   */
  async crear(
    payload: CrearLiquidacionDTO,
  ): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await this.apiClient.post<ResultDTO<LiquidacionDTO>>(
      this.basePath,
      payload,
    );
    return data;
  }

  /**
   * Obtener una liquidación por ID
   */
  async obtenerPorId(id: number): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await this.apiClient.get<ResultDTO<LiquidacionDTO>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async anular(id: number): Promise<ResultDTO<boolean>> {
    const { data } = await this.apiClient.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/anular`,
    );
    return data;
  }

  async editar(
    payload: EditarLiquidacionDTO,
  ): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await this.apiClient.put<ResultDTO<LiquidacionDTO>>(
      `${this.basePath}/${payload.id}`,
      payload,
    );
    return data;
  }
}

export const liquidacionesService = new LiquidacionesService();
