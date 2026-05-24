import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../pages/LoginPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CategoriasPage } from '../pages/CategoriasPage';
import { IngredientesPage } from '../pages/IngredientesPage';
import { ProductosPage } from '../pages/ProductosPage';
import { ProductoDetallePage } from '../pages/ProductoDetallePage';
import { PedidosPage } from '../pages/PedidosPage';
import { PedidoDetallePage } from '../pages/PedidoDetallePage';
import { UsuariosPage } from '../pages/UsuariosPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Rutas protegidas — requieren estar autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Solo ADMIN */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>

          {/* ADMIN o STOCK */}
          <Route element={<ProtectedRoute roles={['ADMIN', 'STOCK']} />}>
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<ProductoDetallePage />} />
          </Route>

          {/* ADMIN o PEDIDOS */}
          <Route element={<ProtectedRoute roles={['ADMIN', 'PEDIDOS']} />}>
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
