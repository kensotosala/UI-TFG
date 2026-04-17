import api from "@/lib/axios-config";
import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
} from "../types";

const BASE = "/Permisos";

export const permisoService = {
  async getAll(): Promise<Permiso[]> {
    const { data } = await api.get<Permiso[]>(BASE);
    return data;
  },

  async getById(id: number): Promise<Permiso> {
    const { data } = await api.get<Permiso>(`${BASE}/${id}`);
    return data;
  },

  async create(dto: CrearPermisoDTO): Promise<Permiso> {
    const { data } = await api.post<Permiso>(BASE, dto);
    return data;
  },

  async update(id: number, dto: ActualizarPermisoDTO): Promise<Permiso> {
    const { data } = await api.put<Permiso>(`${BASE}/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/${id}`);
  },

  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarPermisoDTO,
  ): Promise<void> {
    if (!dto || !dto.estadoSolicitud) {
      throw new Error("DTO inválido");
    }

    await api.put(
      `/Permisos/${id}/aprobar-rechazar`,
      JSON.parse(JSON.stringify(dto)), // 👈 fuerza serialización limpia
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },

  async getByEmpleado(empleadoId: number): Promise<Permiso[]> {
    const { data } = await api.get<Permiso[]>(
      `/Permisos/empleado/${empleadoId}`,
    );
    return data;
  },

  async getPendientesByJefe(jefeId: number): Promise<Permiso[]> {
    const { data } = await api.get<Permiso[]>(`/Permisos/pendientes/${jefeId}`);
    return data;
  },
};
