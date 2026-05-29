import { create } from 'zustand';
import type { Usuario } from '../../usuarios/types';
import type { RolCodigo } from '../../usuarios/types';
import { authService } from '../services/authService';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  hasRole: (...roles: RolCodigo[]) => boolean;
  hasAnyRole: (roles: RolCodigo[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearSession: () => void;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setError: (msg) => set({ error: msg }),

  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return user.roles.some((r) => roles.includes(r.codigo));
  },

  hasAnyRole: (roles) =>
    get().user?.roles.some((r) => roles.includes(r.codigo)) ?? false,

  clearSession: () =>
    set({ user: null, isAuthenticated: false, isLoading: false, error: null }),

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      await authService.login(email, password);
      const user = await authService.me();
      set({ user, isAuthenticated: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error de inicio de sesión';
      set({ user: null, isAuthenticated: false, error: msg });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Aun si falla la red, limpiamos el estado local.
    }
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
  },
}));
