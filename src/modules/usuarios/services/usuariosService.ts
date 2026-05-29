import { apiClient } from '../../../api/client';
import type { Usuario, RolCodigo } from '../types';

interface PaginatedResponse<T> {
  items: T[];
}

interface UsuarioFiltros {
  rol?: RolCodigo;
  page?: number;
  size?: number;
}

export async function getUsuarios(filtros: UsuarioFiltros = {}): Promise<Usuario[]> {
  const { data } = await apiClient.get<PaginatedResponse<Usuario>>('/v1/admin/usuarios', {
    params: filtros,
  });
  return data.items;
}

export async function getUsuario(id: number): Promise<Usuario> {
  const { data } = await apiClient.get<Usuario>(`/v1/admin/usuarios/${id}`);
  return data;
}

export async function modificarRolesUsuario(
  usuarioId: number,
  agregar: RolCodigo[] = [],
  quitar: RolCodigo[] = []
): Promise<void> {
  await apiClient.post(`/v1/admin/usuarios/${usuarioId}/roles`, { agregar, quitar });
}

export async function registrarUsuario(body: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}): Promise<Usuario> {
  const { data } = await apiClient.post<Usuario>('/v1/auth/register', body);
  return data;
}

export async function desactivarUsuario(id: number): Promise<void> {
  await apiClient.delete(`/v1/admin/usuarios/${id}`);
}
