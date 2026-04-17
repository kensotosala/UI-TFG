import api from "@/lib/axios-config";

import {
  CrearLiquidacionDTO,
  EditarLiquidacionDTO,
  LiquidacionDTO,
  ResultDTO,
} from "../types";

class LiquidacionesService {
  private readonly basePath = "/Liquidaciones";

  // ========================================
  // LISTAR
  // ========================================

  async listar(): Promise<ResultDTO<LiquidacionDTO[]>> {
    const { data } = await api.get<ResultDTO<LiquidacionDTO[]>>(this.basePath);
    return data;
  }

  async listarPorEmpleado(
    idEmpleado: number,
  ): Promise<ResultDTO<LiquidacionDTO[]>> {
    const { data } = await api.get<ResultDTO<LiquidacionDTO[]>>(
      `${this.basePath}/empleado/${idEmpleado}`,
    );
    return data;
  }

  // ========================================
  // CRUD
  // ========================================

  async crear(
    payload: CrearLiquidacionDTO,
  ): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await api.post<ResultDTO<LiquidacionDTO>>(
      this.basePath,
      payload,
    );
    return data;
  }

  async obtenerPorId(id: number): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await api.get<ResultDTO<LiquidacionDTO>>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async editar(
    payload: EditarLiquidacionDTO,
  ): Promise<ResultDTO<LiquidacionDTO>> {
    const { data } = await api.put<ResultDTO<LiquidacionDTO>>(
      `${this.basePath}/${payload.id}`,
      payload,
    );
    return data;
  }

  async anular(id: number): Promise<ResultDTO<boolean>> {
    const { data } = await api.patch<ResultDTO<boolean>>(
      `${this.basePath}/${id}/anular`,
    );
    return data;
  }
}

export const liquidacionesService = new LiquidacionesService();
export default liquidacionesService;
