import { apiClient } from '../../../api/client';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types';

interface PaginatedResponse<T> {
  items: T[];
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await apiClient.get<PaginatedResponse<Categoria>>('/categorias');
  return data.items;
}

export async function getCategoria(id: number): Promise<Categoria> {
  const { data } = await apiClient.get<Categoria>(`/categorias/${id}`);
  return data;
}

export async function createCategoria(body: CategoriaCreate): Promise<Categoria> {
  const { data } = await apiClient.post<Categoria>('/categorias', body);
  return data;
}

export async function updateCategoria(id: number, body: CategoriaUpdate): Promise<Categoria> {
  const { data } = await apiClient.put<Categoria>(`/categorias/${id}`, body);
  return data;
}

export async function deleteCategoria(id: number): Promise<void> {
  await apiClient.delete(`/categorias/${id}`);
}
