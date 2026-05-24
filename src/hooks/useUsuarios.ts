import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { queryKeys } from '../api/queryKeys';
import type { Usuario, RolCodigo, PaginatedResponse } from '../types';

interface UsuarioFiltros {
  rol?: RolCodigo;
  page?: number;
  size?: number;
}

export const useUsuarios = (filtros: UsuarioFiltros = {}) => {
  return useQuery<Usuario[]>({
    queryKey: queryKeys.usuarios.list(filtros),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Usuario>>('/v1/admin/usuarios', {
        params: filtros,
      });
      return data.items;
    },
  });
};

export const useUsuario = (id: number) => {
  return useQuery<Usuario>({
    queryKey: queryKeys.usuarios.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Usuario>(`/v1/admin/usuarios/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useModificarRoles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      usuarioId,
      agregar = [],
      quitar = [],
    }: {
      usuarioId: number;
      agregar?: RolCodigo[];
      quitar?: RolCodigo[];
    }) => {
      await apiClient.post(`/v1/admin/usuarios/${usuarioId}/roles`, { agregar, quitar });
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.detail(vars.usuarioId) });
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};

export const useRegistrarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      email: string;
      password: string;
      nombre: string;
      apellido: string;
      telefono?: string;
    }) => {
      const { data } = await apiClient.post<Usuario>('/v1/auth/register', body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};

export const useDesactivarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/admin/usuarios/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};
