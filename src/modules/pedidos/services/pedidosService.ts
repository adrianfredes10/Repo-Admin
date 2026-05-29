import { apiClient } from '../../../api/client';
import type { Pedido } from '../types';

interface PedidoFiltros {
  estado_codigo?: string;
  usuario_id?: number;
  page?: number;
  size?: number;
}

export async function getPedidos(filtros: PedidoFiltros = {}): Promise<Pedido[]> {
  const { data } = await apiClient.get<Pedido[]>('/v1/pedidos', { params: filtros });
  return data;
}

export async function getPedido(id: number): Promise<Pedido> {
  const { data } = await apiClient.get<Pedido>(`/v1/pedidos/${id}`);
  return data;
}

export async function avanzarEstadoPedido(id: number): Promise<Pedido> {
  const { data } = await apiClient.post<Pedido>(`/v1/pedidos/${id}/avanzar`);
  return data;
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const { data } = await apiClient.post<Pedido>(`/v1/pedidos/${id}/cancelar`);
  return data;
}
