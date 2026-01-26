import { useAuthContext } from "@/components/providers/AuthProvider";

export const useUserRole = () => {
  const { user } = useAuthContext();
  return user?.roles[0] || null;
};
