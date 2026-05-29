export type EstadoCodigo =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface EstadoPedido {
  id: number;
  codigo: EstadoCodigo;
  nombre: string;
  orden: number;
}

export interface FormaPago {
  id: number;
  codigo: string;
  nombre: string;
  activa: boolean;
}

export interface DireccionEntregaResumen {
  id: number;
  alias: string;
  calle: string;
  numero: string;
  ciudad: string;
}

export interface DetallePedido {
  producto_id: number;
  producto_nombre: string;
  precio_unitario: string;
  cantidad: number;
  subtotal: string;
}

export interface HistorialEstado {
  id: number;
  estado_anterior: EstadoPedido | null;
  estado_nuevo: EstadoPedido;
  usuario: { id: number; nombre: string };
  fecha: string;
  observacion: string | null;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  direccion_entrega: DireccionEntregaResumen;
  forma_pago: FormaPago;
  estado: EstadoPedido;
  total: string;
  observaciones: string | null;
  fecha_creacion: string;
  fecha_confirmacion: string | null;
  fecha_entrega: string | null;
  items: DetallePedido[];
  historial: HistorialEstado[];
}
