import { useEffect, useRef, useState } from 'react';
import type { EstadoCodigo } from '../pedidos/types';
import { getWsBase } from '../../api/config';

// Evento que emite el backend (FINAL.pdf §9.4) — payload PLANO (no anidado en `data`).
// 'WS_CONNECTED' es un evento sintético local que emite el hook al (re)conectar,
// para que las páginas resincronicen datos (§9.6).
export interface WSEvento {
  event: 'estado_cambiado' | 'pedido_cancelado' | 'pago_confirmado' | 'WS_CONNECTED';
  pedido_id?: number;
  estado_anterior?: EstadoCodigo | null;
  estado_nuevo?: EstadoCodigo;
  usuario_id?: number | null;
  motivo?: string | null;
  timestamp?: string;
}

interface UseOrderStatusWSOptions {
  onMessage?: (msg: WSEvento) => void;
  enabled?: boolean;
}

// Canal staff (ADMIN/PEDIDOS) — FINAL.pdf §9.2. La cookie HttpOnly autentica el handshake.
const WS_URL = `${getWsBase()}/ws/pedidos`;

// Máximo de reintentos antes de rendirse y mostrar "Sin conexión en tiempo real" (§9.6).
const MAX_RETRIES = 10;

/**
 * Hook del feed de pedidos en tiempo real del panel (FINAL.pdf §9).
 *
 * AUTH: cookie HttpOnly `access_token` — el browser la manda sola en el handshake.
 * No va ningún token en la URL (decisión de equipo, ver docs/CONTRATO-API.md §WebSocket).
 *
 * CÓDIGOS DE CIERRE:
 *  - 1000   cierre limpio / desmonte           → no reintenta
 *  - 1008   sin sesión / token inválido        → no reintenta (reintentar no sirve)
 *  - 4001   token expirado (§9.6)              → no reintenta (TODO: refresh cuando exista /auth/refresh)
 *  - otros  cierre anormal                      → backoff exponencial (2s,4s,8s…máx 30s), hasta MAX_RETRIES
 *
 * Expone `connected` (estado reactivo, §9.5) para el badge "Sin conexión en tiempo real".
 * Compatible con React StrictMode (doble mount en desarrollo).
 */
export function useOrderStatusWS({ onMessage, enabled = true }: UseOrderStatusWSOptions = {}) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Ref sincronizada: evita re-ejecutar el efecto cada vez que el padre re-renderiza
  // pasando una nueva función anónima como onMessage.
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
        setConnected(true);
        // Evento sintético: las páginas resincronizan datos al (re)conectar (§9.6),
        // porque los eventos perdidos durante la caída no se reenvían.
        onMessageRef.current?.({ event: 'WS_CONNECTED' });
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data as string) as WSEvento;
          onMessageRef.current?.(msg);
        } catch { /* ignorar mensajes malformados */ }
      };

      ws.onerror = () => { /* onclose siempre sigue a onerror; la lógica de reconexión va allí */ };

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        currentWs = null;
        setConnected(false);

        // Cierre limpio o desmonte → no reintentar
        if (cancelled || e.code === 1000) return;

        // Sin sesión o token inválido → reintentar no sirve
        if (e.code === 1008) {
          console.warn('[WS] Conexión rechazada por el backend (1008). Requiere login.');
          return;
        }

        // Token expirado (§9.6). TODO: cuando exista POST /api/v1/auth/refresh, refrescar
        // la cookie acá y reconectar. Por ahora no reintentamos en loop.
        if (e.code === 4001) {
          console.warn('[WS] Token expirado (4001). Requiere re-login. (TODO §9.6: refresh)');
          return;
        }

        // Cierre anormal → backoff exponencial con tope de intentos (§9.6)
        if (retryCount >= MAX_RETRIES) {
          console.warn(`[WS] Sin conexión en tiempo real tras ${MAX_RETRIES} intentos.`);
          return;
        }
        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30_000);
        console.warn(`[WS] Reconectando en ${delay / 1000}s (intento ${retryCount}/${MAX_RETRIES})`);
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

  return { connected };
}
