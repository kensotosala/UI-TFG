"use client";

import { MarcacionAsistencia } from "@/app/features/asistencia/components/MarcacionAsistencia";
import DisplayDate from "@/components/DisplayDate";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  console.log("Usuario actual:", user);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold mb-4">Bienvenido</h1>

      {/* Usar el employeeId del usuario autenticado */}
      <MarcacionAsistencia empleadoId={user?.employeeId || 0} />

      <DisplayDate />
    </div>
  );
};

export default Home;
