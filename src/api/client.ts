import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '../modules/auth/stores/useAuthStore';
import { getApiBase } from './config';


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
