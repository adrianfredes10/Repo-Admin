import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export const Layout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  const esAdmin = hasAnyRole(['ADMIN']);
  const esStock = hasAnyRole(['STOCK']);
  const esPedidos = hasAnyRole(['PEDIDOS']);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">FS</span>
            </div>
            <span className="font-bold text-base">FoodStore Admin</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-0.5">
          <NavLink to="/" end className={navClass}>
            Dashboard
          </NavLink>

          {esAdmin && (
            <>
              <NavLink to="/categorias" className={navClass}>
                Categorías
              </NavLink>
              <NavLink to="/ingredientes" className={navClass}>
                Ingredientes
              </NavLink>
              <NavLink to="/usuarios" className={navClass}>
                Usuarios
              </NavLink>
            </>
          )}

          {(esAdmin || esStock) && (
            <NavLink to="/productos" className={navClass}>
              Productos
            </NavLink>
          )}

          {(esAdmin || esPedidos) && (
            <NavLink to="/pedidos" className={navClass}>
              Pedidos
            </NavLink>
          )}
        </nav>

        {/* Usuario + logout */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm font-medium text-white truncate">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {user?.roles.map((r) => r.codigo).join(', ')}
          </p>
          <button
            onClick={async () => { await logout(); navigate('/login', { replace: true }); }}
            className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-blue-600 text-white font-medium'
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`;
