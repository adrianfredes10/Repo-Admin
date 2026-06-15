import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import { EstadisticasPanel } from '../../estadisticas/components/EstadisticasPanel';

const MODULOS = [
  {
    roles: ['ADMIN', 'STOCK'] as const,
    path: '/productos',
    title: 'Productos',
    description: 'Catálogo, precios y disponibilidad',
  },
  {
    roles: ['ADMIN'] as const,
    path: '/categorias',
    title: 'Categorías',
    description: 'Organizar categorías y subcategorías',
  },
  {
    roles: ['ADMIN'] as const,
    path: '/ingredientes',
    title: 'Ingredientes',
    description: 'Stock e ingredientes del menú',
  },
  {
    roles: ['ADMIN', 'PEDIDOS'] as const,
    path: '/pedidos',
    title: 'Pedidos',
    description: 'Ver y gestionar pedidos activos',
  },
  {
    roles: ['ADMIN'] as const,
    path: '/usuarios',
    title: 'Usuarios',
    description: 'Administrar usuarios y roles',
  },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  const modulos = MODULOS.filter((m) => hasAnyRole([...m.roles]));
  const esAdmin = hasAnyRole(['ADMIN']);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.nombre} {user?.apellido}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.roles.map((r) => r.nombre).join(' · ')}
        </p>
      </div>

      {/* Panel de estadísticas con gráficos (solo ADMIN, §11) */}
      {esAdmin && (
        <div className="mb-10">
          <EstadisticasPanel enabled={esAdmin} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulos.map((m) => (
          <button
            key={m.path}
            onClick={() => navigate(m.path)}
            className="text-left bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {m.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{m.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
