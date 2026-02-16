import { useQuery } from "@tanstack/react-query";
import { rolesService } from "../services/roles.service";
import { Rol } from "../types";

export const useRolesQuery = () => {
  return useQuery<Rol[]>({
    queryKey: ["roles"],
    queryFn: () => rolesService.getAll(),
  });
};
