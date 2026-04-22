import { AxiosInstance } from "axios";
import {
  ActualizarIncapacidadDTO,
  Incapacidad,
  RegistrarIncapacidadDTO,
} from "../types";
import ApiClient from "@/lib/api/client";

class IncapacidadService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/Incapacidad";
  private readonly baseURL: string;

  constructor() {
    this.apiClient = ApiClient.getInstance();

    const apiURL = ApiClient.getBaseURL();
    try {
      const parsed = new URL(apiURL);
      this.baseURL = parsed.origin;
    } catch {
      this.baseURL = apiURL;
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
    archivo?: File,
  ): Promise<Incapacidad> {
    const formData = new FormData();
    formData.append("EmpleadoId", dto.empleadoId.toString());
    formData.append("FechaInicio", dto.fechaInicio);
    formData.append("FechaFin", dto.fechaFin);
    formData.append("TipoIncapacidad", dto.tipoIncapacidad);
    formData.append("Diagnostico", dto.diagnostico);

    if (archivo) {
      formData.append("archivo", archivo);
    }

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
