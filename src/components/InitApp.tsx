import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../modules/auth/stores/useAuthStore';

export function InitApp({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Esperar a que se resuelva la sesión antes de renderizar las rutas.
  // Sin esto, ProtectedRoute ve isAuthenticated=false y redirige al login
  // aunque la cookie sea válida.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
