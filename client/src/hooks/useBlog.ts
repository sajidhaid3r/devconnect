import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => (await api.get("/blog", { params: { page } })).data.data,
  });
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => (await api.get(`/blog/${slug}`)).data.data,
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; contentMarkdown: string; published?: boolean }) =>
      (await api.post("/blog", payload)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
