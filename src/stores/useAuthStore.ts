import { create } from 'zustand';
import type { Usuario, RolCodigo } from '../types';
import { authApi } from '../api/authApi';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  // Arranca en true para que la UI espere la verificación de sesión antes
  // de decidir si mostrar login o contenido protegido.
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

  // Rehidrata el store al iniciar la app. Si la cookie httpOnly sigue
  // siendo válida, el backend devuelve el usuario; si no, queda anónimo.
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.requestMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    // No tocamos isLoading aquí — isLoading solo es para checkAuth (carga inicial).
    // Si lo seteáramos true, InitApp desmonataría App y BrowserRouter, rompiendo navigate().
    set({ error: null });
    try {
      await authApi.requestLogin(email, password);
      const user = await authApi.requestMe();
      set({ user, isAuthenticated: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error de inicio de sesión';
      set({ user: null, isAuthenticated: false, error: msg });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authApi.requestLogout();
    } catch {
      // Aun si falla la red, limpiamos el estado local.
    }
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
  },
}));
