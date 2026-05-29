import { apiClient } from '../../../api/client';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types';

export async function getIngredientes(): Promise<Ingrediente[]> {
  const { data } = await apiClient.get<Ingrediente[]>('/v1/ingredientes');
  return data;
}

export async function getIngrediente(id: number): Promise<Ingrediente> {
  const { data } = await apiClient.get<Ingrediente>(`/v1/ingredientes/${id}`);
  return data;
}

export async function createIngrediente(body: IngredienteCreate): Promise<Ingrediente> {
  const { data } = await apiClient.post<Ingrediente>('/v1/ingredientes', body);
  return data;
}

export async function updateIngrediente(id: number, body: IngredienteUpdate): Promise<Ingrediente> {
  const { data } = await apiClient.put<Ingrediente>(`/v1/ingredientes/${id}`, body);
  return data;
}

export async function deleteIngrediente(id: number): Promise<void> {
  await apiClient.delete(`/v1/ingredientes/${id}`);
}
