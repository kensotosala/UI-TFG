import { AxiosInstance } from "axios";
import {
  ActualizarIncapacidadDTO,
  Incapacidad,
  RegistrarIncapacidadDTO,
} from "../types";
import ApiClient from "@/lib/api/client";

class IncapacidadService {
  private readonly apiClient: AxiosInstance;
  private readonly baseURL: string;
  private readonly basePath = "/v1/Incapacidad";

  constructor() {
    this.apiClient = ApiClient.getInstance();

    const apiURL = ApiClient.getBaseURL();
    this.baseURL = apiURL.replace(/\/api$/, "");
  }

  /**
   * Procesa una incapacidad para construir la URL completa del archivo adjunto
   */
  private procesarIncapacidad(incapacidad: Incapacidad): Incapacidad {
    // Si no hay archivo adjunto, devolver tal cual
    if (!incapacidad.archivoAdjunto) {
      return incapacidad;
    }

    // Si ya es una URL completa (http://, https://), devolver tal cual
    if (incapacidad.archivoAdjunto.startsWith("http")) {
      return incapacidad;
    }

    // Asegurarse de que la ruta comience con /
    const rutaArchivo = incapacidad.archivoAdjunto.startsWith("/")
      ? incapacidad.archivoAdjunto
      : `/${incapacidad.archivoAdjunto}`;

    // Construir la URL completa
    return {
      ...incapacidad,
      archivoAdjunto: `${this.baseURL}${rutaArchivo}`,
    };
  }

  /**
   * Procesa un array de incapacidades
   */
  private procesarIncapacidades(incapacidades: Incapacidad[]): Incapacidad[] {
    return incapacidades.map((inc) => this.procesarIncapacidad(inc));
  }

  /**
   * Listar las incapacidades
   * GET /api/v1/Incapacidad
   */
  async listarIncapacidades(): Promise<Incapacidad[]> {
    const { data } = await this.apiClient.get<Incapacidad[]>(this.basePath);
    return this.procesarIncapacidades(data);
  }

  /**
   * Obtener incapacidad por ID
   * GET /api/v1/Incapacidad/{id}
   */
  async obtenerIncapacidadPorId(id: number): Promise<Incapacidad> {
    const { data } = await this.apiClient.get<Incapacidad>(
      `${this.basePath}/${id}`,
    );
    return this.procesarIncapacidad(data);
  }

  /**
   * Registrar nueva incapacidad
   * POST /api/v1/Incapacidad
   */
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
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return this.procesarIncapacidad(data);
  }

  /**
   * Actualizar una incapacidad
   * PUT /api/v1/Incapacidad/{id}
   */
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

  /**
   * Eliminar incapacidad
   * DELETE /api/v1/Incapacidad/{id}
   */
  async eliminarIncapacidad(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const incapacidadService = new IncapacidadService();
export default incapacidadService;
