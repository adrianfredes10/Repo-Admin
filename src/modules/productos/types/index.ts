import type { Categoria } from '../../categorias/types';

export interface ProductoIngrediente {
  ingrediente_id: number;
  nombre: string;
  cantidad: number;
  unidad_medida: string;
  es_alergeno: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string;
  disponible: boolean;
  stock_cantidad: number;
  imagen_url: string | null;
  created_at: string;
  categoria_id?: number;
  categoria: Categoria | null;
  ingredientes: ProductoIngrediente[];
}

export interface ProductoIngredienteInput {
  ingrediente_id: number;
  cantidad: number;
  es_alergeno?: boolean;
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible?: boolean;
  stock_cantidad?: number;
  imagen_url?: string;
  categoria_id: number;
  ingredientes: ProductoIngredienteInput[];
}

export interface ProductoUpdate {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  stock_cantidad?: number;
  imagen_url?: string;
  categoria_id: number;
  ingredientes: ProductoIngredienteInput[];
}

export interface ProductoDisponibilidadUpdate {
  disponible: boolean;
}
