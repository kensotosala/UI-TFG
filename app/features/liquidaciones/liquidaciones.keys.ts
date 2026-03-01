export const liquidacionesKeys = {
  all: ["liquidaciones"] as const,

  lists: () => [...liquidacionesKeys.all, "list"] as const,

  list: (filters?: string) => [...liquidacionesKeys.lists(), filters] as const,

  details: () => [...liquidacionesKeys.all, "detail"] as const,

  detail: (id: number) => [...liquidacionesKeys.details(), id] as const,
};
