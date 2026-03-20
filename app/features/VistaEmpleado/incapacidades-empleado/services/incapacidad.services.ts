import { AxiosInstance } from "axios";
import {
  ActualizarIncapacidadDTO,
  EstadoIncapacidad,
  Incapacidad,
  RegistrarIncapacidadDTO,
  TipoIncapacidad,
} from "../types";
import ApiClient from "@/lib/api/client";

class IncapacidadService {
  private readonly apiClient: AxiosInstance;
  private readonly baseURL: string;
  private readonly basePath = "/v1/Incapacidad";

  constructor() {
    this.apiClient = ApiClient.getInstance();
    // FIX #3: usar URL nativo para parsear correctamente
    const apiURL = ApiClient.getBaseURL();
    try {
      const parsed = new URL(apiURL);
      // Remover el segmento /api del pathname si existe
      parsed.pathname = parsed.pathname.replace(/\/api\/?$/, "");
      this.baseURL = parsed.toString().replace(/\/$/, "");
    } catch {
      // fallback si no es URL absoluta
      this.baseURL = apiURL.replace(/\/api\/?$/, "");
    }
  }

  private procesarIncapacidad(incapacidad: Incapacidad): Incapacidad {
    const base = {
      ...incapacidad,
      tipoIncapacidad: incapacidad.tipoIncapacidad as TipoIncapacidad,
      estado: incapacidad.estado as EstadoIncapacidad,
    };

    if (!base.archivoAdjunto) return base;
    if (base.archivoAdjunto.startsWith("http")) return base;

    const rutaArchivo = base.archivoAdjunto.startsWith("/")
      ? base.archivoAdjunto
      : `/${base.archivoAdjunto}`;

    return {
      ...base,
      archivoAdjunto: `${this.baseURL}${rutaArchivo}`,
    };
  }

  private procesarIncapacidades(incapacidades: Incapacidad[]): Incapacidad[] {
    return incapacidades.map((inc) => this.procesarIncapacidad(inc));
  }

  async listarIncapacidades(): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(this.basePath);
    return this.procesarIncapacidades(data);
  }

  // Endpoint filtrado por empleado — evita traer todos los registros
  async listarIncapacidadesPorEmpleado(
    empleadoId: number,
  ): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(this.basePath, {
      params: { empleadoId },
    });
    return this.procesarIncapacidades(data);
  }

  async obtenerIncapacidadPorId(id: number): Promise<Incapacidad> {
    const { data } = await this.apiClient.get<Incapacidad>(
      `${this.basePath}/${id}`,
    );
    return this.procesarIncapacidad(data);
  }

  async registrarIncapacidad(
    dto: RegistrarIncapacidadDTO,
    archivo?: File,
  ): Promise<Incapacidad> {
    const formData = new FormData();
    formData.append("empleadoId", dto.empleadoId.toString());
    formData.append("fechaInicio", dto.fechaInicio);
    formData.append("fechaFin", dto.fechaFin);
    formData.append("tipoIncapacidad", dto.tipoIncapacidad);
    formData.append("diagnostico", dto.diagnostico);

    if (archivo) {
      formData.append("archivo", archivo);
    }

    const { data } = await this.apiClient.post<Incapacidad>(
      this.basePath,
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );

    return this.procesarIncapacidad(data);
  }

  async actualizarIncapacidad(
    id: number,
    dto: ActualizarIncapacidadDTO,
  ): Promise<Incapacidad> {
    const { data } = await this.apiClient.put<Incapacidad>(
      `${this.basePath}/${id}`,
      dto,
    );
    return this.procesarIncapacidad(data);
  }

  async eliminarIncapacidad(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const incapacidadService = new IncapacidadService();
export default incapacidadService;
