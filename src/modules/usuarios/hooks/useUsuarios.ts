import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import {
  getUsuarios,
  getUsuario,
  modificarRolesUsuario,
  registrarUsuario,
  desactivarUsuario,
} from '../services/usuariosService';
import type { RolCodigo } from '../types';

interface UsuarioFiltros {
  rol?: RolCodigo;
  page?: number;
  size?: number;
}

export const useUsuarios = (filtros: UsuarioFiltros = {}) => {
  return useQuery({
    queryKey: queryKeys.usuarios.list(filtros),
    queryFn: () => getUsuarios(filtros),
  });
};

export const useUsuario = (id: number) => {
  return useQuery({
    queryKey: queryKeys.usuarios.detail(id),
    queryFn: () => getUsuario(id),
    enabled: !!id,
  });
};

export const useModificarRoles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      usuarioId,
      agregar = [],
      quitar = [],
    }: {
      usuarioId: number;
      agregar?: RolCodigo[];
      quitar?: RolCodigo[];
    }) => modificarRolesUsuario(usuarioId, agregar, quitar),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.detail(vars.usuarioId) });
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};

export const useRegistrarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      nombre: string;
      apellido: string;
      telefono?: string;
    }) => registrarUsuario(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};

export const useDesactivarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => desactivarUsuario(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.usuarios.list({}) });
    },
  });
};

