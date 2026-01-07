import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7121/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token JWT a cada request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y no es una solicitud de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Limpiar datos de autenticación
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_expires");

        // Redirigir a login
        window.location.href = "/login";
      }

      return Promise.reject(
        new Error("Sesión expirada. Por favor, inicie sesión nuevamente.")
      );
    }

    // Manejo de otros errores
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Timeout: El servidor no responde. Por favor, intente nuevamente."
      );
    }

    if (error.response?.status === 0) {
      throw new Error(
        "Error de conexión: Verifica tu conexión a internet o que el servidor esté corriendo."
      );
    }

    if (error.response?.status === 404) {
      throw new Error("Recurso no encontrado.");
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
