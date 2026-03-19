"use client";

import DisplayDate from "@/components/DisplayDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  TrendingUp,
  Briefcase,
  Building2,
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { MarcarAsistenciaCard } from "@/app/features/VistaEmpleado/asistencia-empleado/components/MarcarAsistenciaCard";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center flex-col md:flex-row gap-5">
        {/* Card azul (más grande) */}
        <div className="flex-2 bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-lg p-6 text-white shadow-lg ">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                ¡Bienvenido, {user?.fullName || user?.username}!
              </h1>
              <p className="text-blue-100">
                {user?.employeeCode && `Código: ${user.employeeCode} • `}
                {user?.roles?.join(", ") || "Usuario"}
              </p>
            </div>

            <div className="mt-4 text-right">
              <DisplayDate />
            </div>
          </div>
        </div>

        {/* Card derecha */}
        <div className="flex-1">
          <MarcarAsistenciaCard />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Gestión de Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ver, crear y administrar empleados de la empresa
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Control de Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registrar y revisar asistencias diarias
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Puestos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Administrar puestos y roles laborales
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestionar áreas y estructura organizacional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm flex-1">
                <span className="font-medium">Juan Pérez</span> registró su
                entrada
              </p>
              <span className="text-xs text-muted-foreground">Hace 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm flex-1">
                <span className="font-medium">María García</span> solicitó
                permiso
              </p>
              <span className="text-xs text-muted-foreground">Hace 15 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <p className="text-sm flex-1">
                <span className="font-medium">Carlos López</span> registró horas
                extra
              </p>
              <span className="text-xs text-muted-foreground">Hace 1 hora</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
