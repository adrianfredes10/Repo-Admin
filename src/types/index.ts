export type { Categoria, CategoriaCreate, CategoriaUpdate } from './categoria';
export type { Ingrediente, IngredienteCreate, IngredienteUpdate } from './ingrediente';
export type {
  Producto,
  ProductoIngrediente,
  ProductoIngredienteInput,
  ProductoCreate,
  ProductoUpdate,
  ProductoDisponibilidadUpdate,
} from './producto';
export type { Usuario, Rol, RolCodigo } from './usuario';
export type {
  Pedido,
  DetallePedido,
  HistorialEstado,
  EstadoPedido,
  EstadoCodigo,
  FormaPago,
} from './pedido';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
