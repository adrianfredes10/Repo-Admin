import { useEffect, useRef, useCallback } from 'react';
import { getApiBase } from '../../api/config';
import type { EstadoCodigo } from '../pedidos/types';

export interface WSEvento {
  event: 'PEDIDO_ACTUALIZADO' | 'ping' | 'WS_CONNECTED';
  data?: {
    pedido_id: number;
    estado_nuevo: EstadoCodigo;
    timestamp: string;
  };
}

interface UseWebSocketOptions {
  onMessage?: (msg: WSEvento) => void;
  enabled?: boolean;
}

/**
 * Hook que gestiona una conexión WebSocket persistente con el backend.
 *
 * AUTH: el browser envía la cookie access_token (HttpOnly) automáticamente
 * en el handshake. No va ningún token en la URL.
 * Code 1008 = auth rechazada por el backend → no reintentar.
 *
 * Reconexión con backoff exponencial: 2s, 4s, 8s … máximo 30s.
 * Compatible con React StrictMode (doble mount en desarrollo).
 */
export function useWebSocket({ onMessage, enabled = true }: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);

  // Ref sincronizada: evita que el efecto se re-ejecute cada vez que el padre
  // re-renderiza pasando una nueva función anónima como onMessage.
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    // cancelled se activa al desmontar; todos los callbacks async lo comprueban
    // para no ejecutar lógica sobre un componente ya desmontado.
    let cancelled = false;
    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let currentWs: WebSocket | null = null;

    const WS_URL = getApiBase().replace(/^http/, 'ws') + '/ws';

    // No se puede llamar close() mientras el socket está en CONNECTING —
    // algunos navegadores lo ignoran o lanzan errores.
    const closeCleanly = (ws: WebSocket) => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close(1000), { once: true });
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000);
      }
    };

    const connect = () => {
      if (cancelled) return;

      const ws = new WebSocket(WS_URL);
      currentWs = ws;
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) { ws.close(1000); return; }
        retryCount = 0;
        // Evento sintético para que las páginas puedan recargar datos al reconectar.
        onMessageRef.current?.({ event: 'WS_CONNECTED' });
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data as string) as WSEvento;
          onMessageRef.current?.(msg);
        } catch { /* ignorar mensajes malformados */ }
      };

      ws.onerror = () => { /* onclose siempre sigue a onerror, lógica allí */ };

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        currentWs = null;

        if (cancelled || e.code === 1000 || e.code === 1008) return;

        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30_000);
        console.warn(`[WS] Reconectando en ${delay / 1000}s (intento ${retryCount})`);
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (currentWs) closeCleanly(currentWs);
      wsRef.current = null;
    };
  }, [enabled]);

  // Suscribe este socket a la sala "order:{orderId}" en el backend.
  // Útil en PedidoDetallePage para recibir eventos de un pedido específico.
  const subscribeToOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'subscribe-order', order_id: orderId }));
    }
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'unsubscribe-order', order_id: orderId }));
    }
  }, []);

  return { subscribeToOrder, unsubscribeFromOrder };
}
