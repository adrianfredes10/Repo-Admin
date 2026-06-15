import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import {
  getPedidosPorEstado,
  getProductosTop,
  getResumen,
} from '../services/estadisticasService';

interface Options {
  // estadísticas es solo-ADMIN: no disparamos las queries si no corresponde
  enabled?: boolean;
  topLimit?: number;
}

export const useEstadisticas = ({ enabled = true, topLimit = 5 }: Options = {}) => {
  const resumen = useQuery({
    queryKey: queryKeys.estadisticas.resumen(),
    queryFn: getResumen,
    enabled,
  });

  const productosTop = useQuery({
    queryKey: queryKeys.estadisticas.productosTop(topLimit),
    queryFn: () => getProductosTop(topLimit),
    enabled,
  });

  const pedidosPorEstado = useQuery({
    queryKey: queryKeys.estadisticas.pedidosPorEstado(),
    queryFn: getPedidosPorEstado,
    enabled,
  });

  return { resumen, productosTop, pedidosPorEstado };
};
