import { apiClient } from '../../../api/client';
import type { Producto, ProductoCreate, ProductoUpdate, ProductoDisponibilidadUpdate } from '../types';

interface PaginatedResponse<T> {
  items: T[];
}

export async function getProductos(categoriaId?: number): Promise<Producto[]> {
  const params = categoriaId ? { categoria_id: categoriaId } : {};
  const { data } = await apiClient.get<PaginatedResponse<Producto>>('/v1/productos', { params });
  return data.items;
}

export async function getProducto(id: number): Promise<Producto> {
  const { data } = await apiClient.get<Producto>(`/v1/productos/${id}`);
  return data;
}

export async function createProducto(body: ProductoCreate): Promise<Producto> {
  const { data } = await apiClient.post<Producto>('/v1/productos', body);
  return data;
}

export async function updateProducto(id: number, body: ProductoUpdate): Promise<Producto> {
  const { data } = await apiClient.put<Producto>(`/v1/productos/${id}`, body);
  return data;
}

export async function toggleDisponibilidadProducto(
  id: number,
  body: ProductoDisponibilidadUpdate
): Promise<Producto> {
  const { data } = await apiClient.patch<Producto>(`/v1/productos/${id}/disponibilidad`, body);
  return data;
}

export async function actualizarStockProducto(
  id: number,
  stock_cantidad: number
): Promise<Producto> {
  const { data } = await apiClient.patch<Producto>(`/v1/productos/${id}/stock`, { stock_cantidad });
  return data;
}

export async function deleteProducto(id: number): Promise<void> {
  await apiClient.delete(`/v1/productos/${id}`);
}
