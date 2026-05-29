import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import {
  getPedidos,
  getPedido,
  avanzarEstadoPedido,
  cancelarPedido,
} from '../services/pedidosService';

interface PedidoFiltros {
  estado_codigo?: string;
  usuario_id?: number;
  page?: number;
  size?: number;
}

export const usePedidos = (filtros: PedidoFiltros = {}) => {
  return useQuery({
    queryKey: queryKeys.pedidos.list(filtros),
    queryFn: () => getPedidos(filtros),
  });
};

export const usePedido = (id: number) => {
  return useQuery({
    queryKey: queryKeys.pedidos.detail(id),
    queryFn: () => getPedido(id),
    enabled: !!id,
  });
};

export const useAvanzarEstado = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => avanzarEstadoPedido(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.list({}) });
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.historial(id) });
    },
  });
};

export const useCancelarPedido = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelarPedido(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.list({}) });
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.pedidos.historial(id) });
    },
  });
};
