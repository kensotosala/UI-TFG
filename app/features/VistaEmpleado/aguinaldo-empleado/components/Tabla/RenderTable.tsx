"use client";

import { useEffect, useState } from "react";
import { AguinaldoDTO } from "@/app/features/aguinaldos/types";
import { DataTable } from "./data-table";
import { columns } from "./Columnas";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function TablaAguinaldosVistaEmpleado() {
  const { user, isAuthenticated } = useAuthContext();
  const [data, setData] = useState<AguinaldoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `https://localhost:7121/api/v1/Aguinaldo/empleado/${user.employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json.datos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

  if (loading) return <p>Cargando aguinaldos...</p>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
