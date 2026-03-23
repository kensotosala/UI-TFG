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
  private readonly baseURL: string;

  constructor() {
    this.apiClient = ApiClient.getInstance();

    const apiURL = ApiClient.getBaseURL();
    try {
      const parsed = new URL(apiURL);
      parsed.pathname = parsed.pathname.replace(/\/api\/?$/, "");
      this.baseURL = parsed.toString().replace(/\/$/, "");
    } catch {
      this.baseURL = apiURL.replace(/\/api\/?$/, "");
    }
  }

  private procesarArchivoAdjunto(incapacidad: Incapacidad): Incapacidad {
    if (!incapacidad.archivoAdjunto) return incapacidad;
    if (incapacidad.archivoAdjunto.startsWith("http")) return incapacidad;

    const ruta = incapacidad.archivoAdjunto.startsWith("/")
      ? incapacidad.archivoAdjunto
      : `/${incapacidad.archivoAdjunto}`;

    return {
      ...incapacidad,
      archivoAdjunto: `${this.baseURL}${ruta}`,
    };
  }

  async ListarIncapacidades(): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(this.basePath);
    return data.map((inc) => this.procesarArchivoAdjunto(inc));
  }

  async ListarPorEmpleado(empleadoId: number): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(
      `${this.basePath}/empleado/${empleadoId}`,
    );
    return data.map((inc) => this.procesarArchivoAdjunto(inc));
  }

  async ObtenerIncapacidadPorId(id: number): Promise<Incapacidad> {
    const { data } = await this.apiClient.get<Incapacidad>(
      `${this.basePath}/${id}`,
    );
    return this.procesarArchivoAdjunto(data);
  }

  async RegistrarIncapacidad(
    dto: RegistrarIncapacidadDTO,
  ): Promise<Incapacidad> {
    const formData = new FormData();
    formData.append("empleadoId", dto.empleadoId.toString());
    formData.append("fechaInicio", dto.fechaInicio);
    formData.append("fechaFin", dto.fechaFin);
    formData.append("tipoIncapacidad", dto.tipoIncapacidad);
    formData.append("diagnostico", dto.diagnostico);
    formData.append("archivo", dto.archivoAdjunto);

    const { data } = await this.apiClient.post<Incapacidad>(
      this.basePath,
      formData,
    );
    return this.procesarArchivoAdjunto(data);
  }

  async ActualizarIncapacidad(
    id: number,
    dto: ActualizarIncapacidadDTO,
  ): Promise<Incapacidad> {
    const { data } = await this.apiClient.put<Incapacidad>(
      `${this.basePath}/${id}`,
      dto,
    );
    return this.procesarArchivoAdjunto(data);
  }

  async EliminarIncapacidad(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const incapacidadService = new IncapacidadService();
export default incapacidadService;
