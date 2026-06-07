import { create } from 'zustand'

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEFAULT_USER: User = {
  id: "guest-session-id",
  name: "Guest User",
  email: "guest@talentflow.ai"
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  token: "guest-mock-token",
  isAuthenticated: true,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

