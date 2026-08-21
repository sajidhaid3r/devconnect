import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: async () => (await api.get("/dashboard")).data.data });
}
