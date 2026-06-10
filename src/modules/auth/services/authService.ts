import { apiClient } from '../../../api/client';
import type { Usuario } from '../../usuarios/types';

export const authService = {
  login: async (email: string, password: string): Promise<Usuario> => {
    const { data } = await apiClient.post<Usuario>('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<Usuario> => {
    const { data } = await apiClient.get<Usuario>('/auth/me');
    return data;
  },
};
