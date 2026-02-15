"use client";

import DisplayDate from "@/components/DisplayDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Briefcase,
  Building2,
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";

const Home = () => {
  const { user } = useAuthContext();

  const stats = [
    {
      title: "Total Empleados",
      value: "124",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Asistencias Hoy",
      value: "98",
      icon: Calendar,
      trend: "+5%",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Horas Extra",
      value: "45h",
      icon: Clock,
      trend: "-3%",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Departamentos",
      value: "8",
      icon: Building2,
      trend: "0%",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.fullName || user?.username}!
            </h1>
            <p className="text-blue-100">
              {user?.employeeCode && `Código: ${user.employeeCode} • `}
              {user?.roles?.join(", ") || "Usuario"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DisplayDate />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge
                      variant="secondary"
                      className="mt-2 text-xs font-normal"
                    >
                      {stat.trend} vs mes anterior
                    </Badge>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
