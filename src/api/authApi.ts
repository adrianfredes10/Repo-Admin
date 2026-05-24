import { apiClient } from './client';
import type { Usuario } from '../types';

export const authApi = {
  // El backend devuelve el usuario y setea la cookie httpOnly en la respuesta.
  requestLogin: async (
    email: string, 
    password: string
  ): Promise<Usuario> => {
    const { data } = await apiClient.post<Usuario>('/v1/auth/login', { email, password });
    return data;
  },

  requestLogout: async ():
  Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },

  // Rehidrata el store al iniciar la app. El navegador envía la cookie
  // automáticamente; si es válida el backend responde con el usuario.
  requestMe: async (): 
  Promise<Usuario> => {
    const { data } = await apiClient.get<Usuario>('/v1/auth/me');
    return data;
  },
};
