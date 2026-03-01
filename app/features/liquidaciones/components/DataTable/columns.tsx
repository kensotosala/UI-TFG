"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LiquidacionDTO } from "../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

const EmpleadoCell = ({ idEmpleado }: { idEmpleado: number }) => {
  const { empleados } = useEmpleados();
  const empleado = empleados.find((emp) => emp.idEmpleado === idEmpleado);
  return (
    <span>
      {empleado
        ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido}`
        : "Desconocido"}
    </span>
  );
};

export const columns: ColumnDef<LiquidacionDTO>[] = [
  {
    accessorKey: "idLiquidacion",
    header: "ID",
  },
  {
    accessorKey: "idEmpleado",
    header: "Empleado",
    cell: ({ row }) => <EmpleadoCell idEmpleado={row.getValue("idEmpleado")} />,
  },
  {
    accessorKey: "montoPreaviso",
    header: "Monto Preaviso",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoPreaviso")),
  },
  {
    accessorKey: "montoVacaciones",
    header: "Monto Vacaciones",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoVacaciones")),
  },
  {
    accessorKey: "montoCesantia",
    header: "Monto Cesantía",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoCesantia")),
  },
  {
    accessorKey: "montoTotal",
    header: "Monto Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(row.getValue("montoTotal")),
  },
];
