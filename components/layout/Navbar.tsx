/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-[#f8fafa] z-10">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-9 w-9 border-2 border-blue-100">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
              />
              <AvatarFallback className="bg-blue-600 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64" sideOffset={10}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                {user?.employeeCode && (
                  <p className="text-xs leading-none text-muted-foreground">
                    ID: {user.employeeCode}
                  </p>
                )}
                {user?.roles && user.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.roles.map((role: any, index: any) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Mi Perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Configuración
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              {isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
