import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

export function useMe() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      setAuth(res.data.data, "cookie"); // token lives in httpOnly cookie
      return res.data.data;
    },
    retry: false,
  });
}

export const useAuth = useMe;


export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post("/auth/login", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (payload: { email: string; username: string; password: string; fullName: string }) => {
      const res = await api.post("/auth/register", payload);
      return res.data.data;
    },
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: async () => api.post("/auth/logout"),
    onSuccess: () => clearAuth(),
  });
}
