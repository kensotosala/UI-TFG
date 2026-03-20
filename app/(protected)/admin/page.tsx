"use client";

import DisplayDate from "@/components/DisplayDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Briefcase, Building2 } from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { MarcarAsistenciaCard } from "@/app/features/VistaEmpleado/asistencia-empleado/components/MarcarAsistenciaCard";
import RecentActivity from "@/components/RecentActivity";

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
      <RecentActivity />
    </div>
  );
};

export default Home;
