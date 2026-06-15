import { apiClient } from '../../../api/client';
import type { PedidosEstadoItem, ProductoTopItem, ResumenResponse } from '../types';

// Endpoints /api/v1/estadisticas/* (exigen rol ADMIN).
// apiClient lleva withCredentials → la cookie de sesión viaja sola.
// El backend expone además /ventas y /ingresos; el panel no los consume.

export async function getResumen(): Promise<ResumenResponse> {
  const { data } = await apiClient.get<ResumenResponse>('/estadisticas/resumen');
  return data;
}

export async function getProductosTop(limit = 5): Promise<ProductoTopItem[]> {
  const { data } = await apiClient.get<ProductoTopItem[]>('/estadisticas/productos-top', {
    params: { limit },
  });
  return data;
}

export async function getPedidosPorEstado(): Promise<PedidosEstadoItem[]> {
  const { data } = await apiClient.get<PedidosEstadoItem[]>('/estadisticas/pedidos-por-estado');
  return data;
}
