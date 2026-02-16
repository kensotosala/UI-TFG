import { useRolesQuery } from "../queries/roles.queries";

export const useRoles = () => {
  const rolesQuery = useRolesQuery();

  return {
    roles: rolesQuery.data ?? [],
    isLoading: rolesQuery.isLoading,
    refetch: rolesQuery.refetch,
  };
};
