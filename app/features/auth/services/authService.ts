/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios-config";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
}

export interface UserData {
  userId: number;
  username: string;
  employeeId?: number;
  employeeCode?: string;
  fullName?: string;
  email?: string;
  departmentId?: number;
  positionId?: number;
  roles: string[];
  roleIds: number[];
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      if (response.data.token) {
        // Guardar token y expiración en cookies
        document.cookie = `auth_token=${response.data.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`; // 7 días
        document.cookie = `auth_expires=${
          response.data.expiration
        }; path=/; max-age=${60 * 60 * 24 * 7}`;

        // Guardar datos del usuario en localStorage
        const userData = this.decodeJWT(response.data.token);
        if (userData) {
          localStorage.setItem("user_data", JSON.stringify(userData));
        }
      }

      return response.data;
    } catch (error: any) {
      // Preservar el status code y el mensaje del error
      const err: any = new Error(
        error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "Credenciales incorrectas. Por favor, verifique su usuario y contraseña.",
      );
      err.status = error.response?.status;
      err.response = error.response;
      throw err;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Error al cerrar sesión en el servidor:", error);
    } finally {
      // Limpiar cookies
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "auth_expires=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Limpiar localStorage
      this.clearAuthData();
    }
  },

  decodeJWT(token: string): UserData | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const payload = JSON.parse(jsonPayload);

      const rawRoles =
        payload.Roles ??
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const roles = Array.isArray(rawRoles)
        ? rawRoles.map((r) => r.toUpperCase())
        : rawRoles
          ? [rawRoles.toUpperCase()]
          : [];

      return {
        userId: Number(
          payload.UserId ??
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
        ),
        username:
          payload.Username ??
          payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        employeeId: Number(payload.EmployeeId ?? 0),
        employeeCode: payload.EmployeeCode ?? "",
        fullName: payload.FullName ?? "",
        email: payload.Email ?? "",
        departmentId: Number(payload.DepartmentId ?? 0),
        positionId: Number(payload.PositionId ?? 0),
        roles,
        roleIds: payload.RoleId
          ? payload.RoleId.toString().split(",").map(Number)
          : [],
      };
    } catch (error) {
      console.error("❌ Error al decodificar JWT:", error);
      return null;
    }
  },

  getCurrentUser(): UserData | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("user_data");
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error al parsear datos de usuario:", error);
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token" && value) {
        return value;
      }
    }

    return localStorage.getItem("auth_token");
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = this.getToken();
    if (!token) return false;

    const expiresCookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("auth_expires="));
    const expires =
      expiresCookie?.split("=")[1] || localStorage.getItem("auth_expires");

    if (expires) {
      const expiryDate = new Date(expires);
      if (expiryDate < new Date()) {
        this.clearAuthData();
        return false;
      }
    }

    return true;
  },

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.includes(role);
  },

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.some((role) => roles.includes(role));
  },

  clearAuthData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_expires");
  },

  isTokenExpiringSoon(minutes = 5): boolean {
    const expiresCookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("auth_expires="));
    const expires =
      expiresCookie?.split("=")[1] || localStorage.getItem("auth_expires");

    if (!expires) return true;

    const expiryDate = new Date(expires);
    const now = new Date();
    const diffMinutes = (expiryDate.getTime() - now.getTime()) / (1000 * 60);

    return diffMinutes < minutes;
  },

  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get("/api/auth/verify");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};
