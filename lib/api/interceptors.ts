import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);

    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }
  }
  return config;
};

const errorInterceptor = (
  error: AxiosError<{ mensaje?: string; message?: string }>,
) => {
  if (error.response) {
    const mensaje =
      error.response.data?.mensaje ||
      error.response.data?.message ||
      `Error ${error.response.status}: ${error.response.statusText}`;
    throw new Error(mensaje);
  } else if (error.request) {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  } else {
    throw new Error(
      error.message || "Error inesperado al realizar la petición",
    );
  }
};

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(authInterceptor, (error) =>
    Promise.reject(error),
  );
  instance.interceptors.response.use((response) => response, errorInterceptor);
};
