import { apiClient } from '../../../api/client';
import type { Pedido } from '../types';

interface PedidoFiltros {
  estado_codigo?: string;
  usuario_id?: number;
  page?: number;
  size?: number;
}

export async function getPedidos(filtros: PedidoFiltros = {}): Promise<Pedido[]> {
  const { data } = await apiClient.get<Pedido[]>('/pedidos', { params: filtros });
  return data;
}

export async function getPedido(id: number): Promise<Pedido> {
  const { data } = await apiClient.get<Pedido>(`/pedidos/${id}`);
  return data;
}

export async function avanzarEstadoPedido(id: number): Promise<Pedido> {
  const { data } = await apiClient.post<Pedido>(`/pedidos/${id}/avanzar`);
  return data;
}

export async function cancelarPedido(id: number, motivo: string): Promise<Pedido> {
  // El staff cancela vía PATCH /estado (no /cancelar, que es solo para el dueño
  // del pedido). El backend espera { nuevo_estado, motivo } (AvanzarEstadoRequest).
  // RN-05: el motivo es obligatorio al cancelar.
  const { data } = await apiClient.patch<Pedido>(`/pedidos/${id}/estado`, {
    nuevo_estado: 'CANCELADO',
    motivo,
  });
  return data;
}
