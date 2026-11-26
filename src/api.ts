import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } return Promise.reject(error);
  }
);

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const detail = err.response?.data?.detail;

    if (status === 409 || (typeof detail === 'string' && /closed|cerrado|lleno|full/i.test(detail))) {
      return 'Este recurso ya no está disponible (cerrado o lleno).';
    }
    if (status === 401) {
      return 'Sesión expirada. Por favor, inicia sesión de nuevo.';
    }
    return detail ?? 'Error de conexión con el servidor';
  }
  return 'Error inesperado';
}

export default api;