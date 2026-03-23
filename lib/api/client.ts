import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { setupInterceptors } from "./interceptors";

class ApiClient {
  private static instance: AxiosInstance | null = null;
  private static baseURL: string;

  private constructor() {}

  static getInstance(config?: CreateAxiosDefaults): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.baseURL =
        process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api";

      ApiClient.instance = axios.create({
        baseURL: ApiClient.baseURL,
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
        ...config,
      });

      setupInterceptors(ApiClient.instance);
    }

    return ApiClient.instance;
  }

  static getBaseURL(): string {
    return ApiClient.baseURL;
  }

  static reset(): void {
    ApiClient.instance = null;
  }
}

export default ApiClient;
