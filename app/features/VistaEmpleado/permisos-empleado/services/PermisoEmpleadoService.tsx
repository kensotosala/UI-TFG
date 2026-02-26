import {
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
  CrearPermisoDTO,
  FiltrosPermisos,
  Permiso,
} from "@/app/features/permisos/types";
import ApiClient from "@/lib/api/client";
import { AxiosInstance } from "axios";

class PermisoService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/v1/Permisos";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getAll(): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath);
    return data;
  }

  async getById(id: number): Promise<Permiso> {
    const { data } = await this.apiClient.get<Permiso>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async buscarPorFiltros(filtros: FiltrosPermisos): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath, {
      params: filtros,
    });
    return data;
  }

  async getByEmpleado(empleadoId: number): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath, {
      params: { empleadoId },
    });
    return data;
  }

  async getPendientesByJefe(jefeId: number): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath, {
      params: { jefeApruebaId: jefeId, estadoSolicitud: "PENDIENTE" },
    });
    return data;
  }

  async create(dto: CrearPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.post<Permiso>(this.basePath, dto);
    return data;
  }

  async update(id: number, dto: ActualizarPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.put<Permiso>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }

  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarPermisoDTO,
  ): Promise<void> {
    await this.apiClient.patch(`${this.basePath}/${id}/aprobar-rechazar`, dto);
  }
}

export const permisoService = new PermisoService();
export default permisoService;
