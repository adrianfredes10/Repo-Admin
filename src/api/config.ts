export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw || typeof raw !== "string") {
    throw new Error("Falta VITE_API_BASE_URL en .env");
  }
  return raw.replace(/\/$/, "");
}

// Origen del WebSocket (ej: ws://localhost:8000), tomado de VITE_WS_URL.
// El path del endpoint (/ws/pedidos, FINAL.pdf §9.2) lo agrega cada hook, porque
// es parte del CONTRATO: no cambia entre entornos, solo cambia el host.
export function getWsBase(): string {
  const raw = import.meta.env.VITE_WS_URL;
  if (!raw || typeof raw !== "string") {
    throw new Error("Falta VITE_WS_URL en .env (ej: ws://localhost:8000)");
  }
  return raw.replace(/\/$/, "");
}
