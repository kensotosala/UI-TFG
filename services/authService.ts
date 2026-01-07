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
        // Guardar token y datos en localStorage
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("auth_expires", response.data.expiration);

        // Decodificar JWT para obtener datos del usuario
        const userData = this.decodeJWT(response.data.token);
        if (userData) {
          localStorage.setItem("user_data", JSON.stringify(userData));
        }
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Credenciales incorrectas. Por favor, verifique su usuario y contraseña."
      );
    }
  },

  async logout(): Promise<void> {
    try {
      // Opcional: llamar al endpoint de logout del backend
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Error al cerrar sesión en el servidor:", error);
    } finally {
      // Limpiar datos locales siempre
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
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // Extraer roles del token
      const roles =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const roleIds =
        payload["RoleId"]?.toString().split(",").map(Number) || [];

      return {
        userId: parseInt(
          payload["UserId"] ||
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
        ),
        username:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || payload["Username"],
        employeeId: parseInt(payload["EmployeeId"] || 0),
        employeeCode: payload["EmployeeCode"] || "",
        fullName: payload["FullName"] || "",
        email: payload["Email"] || "",
        departmentId: parseInt(payload["DepartmentId"] || 0),
        positionId: parseInt(payload["PositionId"] || 0),
        roles: Array.isArray(roles) ? roles : roles ? [roles] : [],
        roleIds: roleIds,
      };
    } catch (error) {
      console.error("Error al decodificar JWT:", error);
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
    return localStorage.getItem("auth_token");
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = this.getToken();
    if (!token) return false;

    // Verificar expiración
    const expires = localStorage.getItem("auth_expires");
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

  // Verificar si el token está a punto de expirar (útil para refrescar)
  isTokenExpiringSoon(minutes = 5): boolean {
    const expires = localStorage.getItem("auth_expires");
    if (!expires) return true;

    const expiryDate = new Date(expires);
    const now = new Date();
    const diffMinutes = (expiryDate.getTime() - now.getTime()) / (1000 * 60);

    return diffMinutes < minutes;
  },
};
