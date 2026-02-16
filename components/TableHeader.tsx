"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TableHeaderProps {
  title: string;
  entity: string;
  onAddClick: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  entity,
  onAddClick,
}) => {
  return (
    <div className="flex items-center mb-6">
      <h1 className="text-2xl font-bold">Lista de {title}</h1>
      <Button
        className="ml-auto"
        style={{ backgroundColor: "#052940" }}
        onClick={onAddClick}
      >
        Agregar {entity}
      </Button>
    </div>
  );
};

export default TableHeader;
