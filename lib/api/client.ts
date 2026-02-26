import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { setupInterceptors } from "./interceptors";

/**
 * PATRÓN: Singleton + Factory
 * Cliente HTTP centralizado para toda la aplicación
 */
class ApiClient {
  private static instance: AxiosInstance | null = null;
  private static baseURL: string;

  private constructor() {}

  /**
   * Obtiene la instancia única de Axios configurada
   */
  static getInstance(config?: CreateAxiosDefaults): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.baseURL =
        process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api";

      ApiClient.instance = axios.create({
        baseURL: ApiClient.baseURL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
        ...config,
      });

      // Configurar interceptors
      setupInterceptors(ApiClient.instance);
    }

    return ApiClient.instance;
  }

  /**
   * Obtiene la URL base de la API
   */
  static getBaseURL(): string {
    return ApiClient.baseURL;
  }

  /**
   * Resetea la instancia (útil para testing)
   */
  static reset(): void {
    ApiClient.instance = null;
  }
}

export default ApiClient;
