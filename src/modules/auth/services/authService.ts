import { apiClient } from '../../../api/client';
import type { Usuario } from '../../usuarios/types';

export const authService = {
  login: async (email: string, password: string): Promise<Usuario> => {
    const { data } = await apiClient.post<Usuario>('/v1/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },

  me: async (): Promise<Usuario> => {
    const { data } = await apiClient.get<Usuario>('/v1/auth/me');
    return data;
  },
};
