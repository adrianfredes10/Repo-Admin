import { apiClient } from '../../../api/client';
import type { Producto, ProductoCreate, ProductoUpdate, ProductoDisponibilidadUpdate } from '../types';

interface PaginatedResponse<T> {
  items: T[];
}

export async function getProductos(categoriaId?: number): Promise<Producto[]> {
  const params = categoriaId ? { categoria_id: categoriaId } : {};
  const { data } = await apiClient.get<PaginatedResponse<Producto>>('/productos', { params });
  return data.items;
}

export async function getProducto(id: number): Promise<Producto> {
  const { data } = await apiClient.get<Producto>(`/productos/${id}`);
  return data;
}

export async function createProducto(body: ProductoCreate): Promise<Producto> {
  const { data } = await apiClient.post<Producto>('/productos', body);
  return data;
}

export async function updateProducto(id: number, body: ProductoUpdate): Promise<Producto> {
  const { data } = await apiClient.put<Producto>(`/productos/${id}`, body);
  return data;
}

export async function toggleDisponibilidadProducto(
  id: number,
  body: ProductoDisponibilidadUpdate
): Promise<Producto> {
  const { data } = await apiClient.patch<Producto>(`/productos/${id}/disponibilidad`, body);
  return data;
}

export async function actualizarStockProducto(
  id: number,
  stock_cantidad: number
): Promise<Producto> {
  const { data } = await apiClient.patch<Producto>(`/productos/${id}/stock`, { stock_cantidad });
  return data;
}

export async function deleteProducto(id: number): Promise<void> {
  await apiClient.delete(`/productos/${id}`);
}

export interface UploadImagenResponse {
  imagen_url: string;
  public_id: string;
  imagenes_url: string[];
}

export async function subirImagenProducto(
  id: number,
  file: File
): Promise<UploadImagenResponse> {
  const formData = new FormData();
  formData.append('file', file);
  // multipart/form-data: apiClient lleva withCredentials → manda la cookie de
  // sesión (el endpoint exige rol ADMIN). Por eso NO usamos fetch pelado.
  const { data } = await apiClient.post<UploadImagenResponse>(
    `/uploads/producto/${id}/imagen`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}
