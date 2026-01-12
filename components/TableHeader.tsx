"use client";

import React from "react";
import { Button } from "./ui/button";

interface TableHeaderProps {
  title: string;
  entity: string;
  onAddClick?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  entity,
  onAddClick,
}) => {
  return (
    <div className="flex items-center mb-6">
      <h1 className="text-3xl font-semibold">Lista de {title}</h1>
      <Button className="ml-auto" onClick={onAddClick}>
        Agregar {entity}
      </Button>
    </div>
  );
};

export default TableHeader;
