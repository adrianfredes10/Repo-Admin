import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const getApiBase = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) throw new Error('Falta VITE_API_BASE_URL en .env');
  return url.replace(/\/$/, '');
};

export const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string | { msg: string }[] }>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    const detail = error.response?.data?.detail;
    let message: string;
    if (Array.isArray(detail)) {
      message = detail.map((d) => d.msg).join(', ');
    } else {
      message = detail ?? error.message ?? 'Error desconocido';
    }
    return Promise.reject(new Error(message));
  },
);
