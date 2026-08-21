import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useProfile(username: string | undefined) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => (await api.get(`/users/${username}`)).data.data,
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => (await api.patch("/users/me", payload)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useSearchDevelopers(params: { skill?: string; location?: string; page?: number }) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: async () => (await api.get("/users/search", { params })).data.data,
  });
}
