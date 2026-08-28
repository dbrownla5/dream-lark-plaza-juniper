import { useQuery } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function useAuthedQuery<T>(key: string, fn: () => Promise<T>) {
  const { user, isPending } = useCurrentUserState();
  return useQuery<T>({
    queryKey: [key],
    queryFn: fn,
    enabled: Boolean(user) && !isPending,
  });
}
