import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useUserProjects(username: string | undefined) {
  return useQuery({
    queryKey: ["projects", username],
    queryFn: async () => (await api.get(`/projects/user/${username}`)).data.data,
    enabled: !!username,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) =>
      (await api.post("/projects", payload, { headers: { "Content-Type": "multipart/form-data" } })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
