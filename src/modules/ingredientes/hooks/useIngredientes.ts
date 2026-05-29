import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import {
  getIngredientes,
  getIngrediente,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from '../services/ingredientesService';
import type { IngredienteCreate, IngredienteUpdate } from '../types';

export const useIngredientes = (id?: number) => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: queryKeys.ingredientes.list(),
    queryFn: getIngredientes,
  });

  const detail = useQuery({
    queryKey: queryKeys.ingredientes.detail(id ?? 0),
    queryFn: () => getIngrediente(id!),
    enabled: !!id,
  });

  const create = useMutation({
    mutationFn: (newIngrediente: IngredienteCreate) => createIngrediente(newIngrediente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.list() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteUpdate }) =>
      updateIngrediente(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.detail(variables.id) });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.list() });
    },
  });

  return { list, detail, create, update, remove };
};
