import { create } from "zustand";

// Zustand for client-only state (per PDF State Mgmt); user identity kept here after login
interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
