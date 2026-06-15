// Tipos del módulo Estadísticas. Espejan los schemas del backend (§11).
// Los montos llegan como string (FastAPI serializa Decimal como string,
// igual que `precio` en productos) → se castean con Number() para los charts.

export interface ResumenResponse {
  ventas_hoy: string;
  ticket_promedio: string;
  pedidos_activos: number;
  ventas_mes: string;
}

export interface ProductoTopItem {
  producto_id: number | null;
  nombre: string;
  cantidad_vendida: number;
  ingresos: string;
}

export interface PedidosEstadoItem {
  estado_codigo: string;
  cantidad: number;
}
