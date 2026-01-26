"use client";

import {
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronUp,
  Clock,
  HeartPulse,
  Home,
  Key,
  PlaneIcon,
  Stethoscope,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const adminMenuGroups = [
  {
    label: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
      },
    ],
  },
  {
    label: "Administración",
    items: [
      {
        title: "Departamentos",
        url: "/admin/departamentos",
        icon: Building2,
      },
      {
        title: "Puestos",
        url: "/admin/puestos",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "Gestión de Personal",
    items: [
      {
        title: "Empleados",
        url: "/admin/empleados",
        icon: User2,
      },
      {
        title: "Asistencias",
        url: "/admin/asistencias",
        icon: CalendarCheck,
      },
      {
        title: "Horas Extra",
        url: "/admin/horas-extra",
        icon: Clock,
      },
      {
        title: "Permisos",
        url: "/admin/permisos",
        icon: Key,
      },
      {
        title: "Incapacidades",
        url: "/admin/incapacidades",
        icon: Stethoscope,
      },
      {
        title: "Vacaciones",
        url: "/admin/vacaciones",
        icon: PlaneIcon,
      },
    ],
  },
];

const empleadoMenuGroups = [
  {
    label: "Mi Portal",
    items: [
      {
        title: "Inicio",
        url: "/empleado",
        icon: Home,
      },
      {
        title: "Mis Asistencias",
        url: "/empleado/asistencias",
        icon: CalendarCheck,
      },
      {
        title: "Mis Permisos",
        url: "/empleado/permisos",
        icon: Key,
      },
      {
        title: "Mis Incapacidades",
        url: "/empleado/asistencias",
        icon: HeartPulse,
      },
      {
        title: "Mis Vacaciones",
        url: "/empleado/vacaciones",
        icon: PlaneIcon,
      },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN");
  const menuGroups = isAdmin ? adminMenuGroups : empleadoMenuGroups;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={isAdmin ? "/admin" : "/empleado"}>
                <Image src="/next.svg" alt="logo" width={20} height={20} />
                <span>All Sport Nutrition</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>{user?.fullName || user?.username || "Usuario"}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Cuenta</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
