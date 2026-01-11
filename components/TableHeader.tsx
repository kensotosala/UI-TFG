import React from "react";
import { Button } from "./ui/button";

interface TableHeaderProps {
  title: string;
  entity: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title, entity }) => {
  return (
    <div className="flex items-center">
      <h1 className="text-3xl font-semibold">Lista de {title}</h1>
      <Button className="ml-auto">Agregar {entity}</Button>
    </div>
  );
};

export default TableHeader;
