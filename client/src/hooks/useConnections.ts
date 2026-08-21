import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useConnections() {
  return useQuery({ queryKey: ["connections"], queryFn: async () => (await api.get("/connections")).data.data });
}

export function useMutualConnections(username: string | undefined) {
  return useQuery({
    queryKey: ["connections", "mutual", username],
    queryFn: async () => (await api.get(`/connections/mutual/${username}`)).data.data,
    enabled: !!username,
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: ["connections", "pending"],
    queryFn: async () => (await api.get("/connections/pending")).data.data,
  });
}

export function useSendConnectionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (addresseeUsername: string) => (await api.post("/connections", { addresseeUsername })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["connections"] }),
  });
}

export function useRespondConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "ACCEPT" | "REJECT" }) =>
      (await api.patch(`/connections/${id}/respond`, { action })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["connections"] }),
  });
}
