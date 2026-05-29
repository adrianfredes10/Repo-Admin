import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import {
  getCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../services/categoriasService';
import type { CategoriaCreate, CategoriaUpdate } from '../types';

export const useCategorias = (id?: number) => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: queryKeys.categorias.list(),
    queryFn: getCategorias,
  });

  const detail = useQuery({
    queryKey: queryKeys.categorias.detail(id ?? 0),
    queryFn: () => getCategoria(id!),
    enabled: !!id,
  });

  const create = useMutation({
    mutationFn: (newCategoria: CategoriaCreate) => createCategoria(newCategoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categorias.list() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) =>
      updateCategoria(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categorias.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categorias.detail(variables.id) });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categorias.list() });
    },
  });

  return { list, detail, create, update, remove };
};
