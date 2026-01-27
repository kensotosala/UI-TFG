import { AxiosInstance } from "axios";
import {
  ActualizarIncapacidadDTO,
  Incapacidad,
  RegistrarIncapacidadDTO,
} from "../types";
import ApiClient from "@/lib/api/client";

class IncapacidadService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/v1/Incapacidad";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  /**
   * Listar las incapacidades
   * GET /api/v1/Incapacidad
   */
  async ListarIncapacidades(): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(this.basePath);
    return data;
  }

  /**
   * Obtener incapacidad por ID
   * GET /api/v1/Incapacidad/{id}
   */
  async ObtenerIncapacidadPorId(id: number): Promise<Incapacidad> {
    const { data } = await this.apiClient.get<Incapacidad>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  /**
   * Registrar nueva incapacidad
   * POST /api/v1/Incapacidad
   */
  async RegistrarIncapacidad(
    dto: RegistrarIncapacidadDTO,
  ): Promise<Incapacidad> {
    const { data } = await this.apiClient.post<Incapacidad>(this.basePath, dto);
    return data;
  }

  /**
   * Actualizar una incapacidad
   * PUT /api/v1/Incapacidad/{id}
   */
  async ActualizarIncapacidad(
    id: number,
    dto: ActualizarIncapacidadDTO,
  ): Promise<Incapacidad> {
    const { data } = await this.apiClient.put<Incapacidad>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  /**
   * Eliminar incapacidad
   * DELETE /api/v1/Incapacidad/{id}
   */
  async EliminarIncapacidad(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const incapacidadService = new IncapacidadService();
export default incapacidadService;
