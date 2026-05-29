import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/stores/useAuthStore';
import type { RolCodigo } from '../../modules/usuarios/types';

interface Props {
  roles?: RolCodigo[];
}

export const ProtectedRoute = ({ roles }: Props) => {
  const { isAuthenticated, hasAnyRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasAnyRole(roles)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
