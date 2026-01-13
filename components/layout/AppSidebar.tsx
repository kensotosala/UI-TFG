"use client";

import {
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronUp,
  Clock,
  Home,
  Key,
  User2,
  Users2,
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

const menuGroups = [
  {
    label: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    label: "Administración",
    items: [
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: Users2,
      },
      {
        title: "Departamentos",
        url: "/departamentos",
        icon: Building2,
      },
      {
        title: "Puestos",
        url: "/puestos",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "Gestión de Personal",
    items: [
      {
        title: "Empleados",
        url: "/empleados",
        icon: User2,
      },
      {
        title: "Asistencias",
        url: "/asistencias",
        icon: CalendarCheck,
      },
      {
        title: "Horas Extra",
        url: "/horas-extra",
        icon: Clock,
      },
      {
        title: "Permisos",
        url: "/permisos",
        icon: Key,
      },
    ],
  },
];

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
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
                <DropdownMenuItem>Equipo</DropdownMenuItem>
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
