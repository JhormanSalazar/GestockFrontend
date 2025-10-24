/**
 * Axios Instance Configuration for Gestock API
 *
 * Configuración centralizada de Axios con:
 * - Base URL configurada desde variables de entorno
 * - Interceptores de request para autenticación JWT
 * - Interceptores de response para manejo de errores
 * - Transformación automática de respuestas
 */

import axios from 'axios';

// Base URL desde variables de entorno o default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/gestock';

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Agrega el token JWT a todas las peticiones autenticadas
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');

    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Maneja respuestas exitosas y errores HTTP de forma centralizada
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    // Extracción automática de data.data si existe (patrón común en APIs)
    // Si la respuesta tiene estructura { data: {...} }, extraer el contenido
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }

    return response;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Construir objeto de error normalizado
    const apiError = {
      message: 'Error en la comunicación con el servidor',
      status: error.response?.status || 500,
      code: error.code,
    };

    // Manejo específico por código de estado HTTP
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // No autorizado - Token inválido o expirado
          apiError.message = 'Sesión expirada. Por favor, inicie sesión nuevamente.';

          // Limpiar localStorage y redirigir a login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');

          // Redirigir a login (solo si no estamos ya en esa ruta)
          if (!window.location.pathname.includes('/auth')) {
            window.location.href = '/auth';
          }
          break;

        case 403:
          // Prohibido - Permisos insuficientes
          apiError.message = 'No tiene permisos para realizar esta acción.';
          break;

        case 404:
          // No encontrado
          apiError.message = 'Recurso no encontrado.';
          break;

        case 422:
          // Validación fallida
          apiError.message = data?.message || 'Error de validación en los datos enviados.';
          apiError.errors = data?.errors; // Errores de validación específicos
          break;

        case 500:
          // Error interno del servidor
          apiError.message = 'Error interno del servidor. Por favor, intente más tarde.';
          break;

        default:
          // Otros errores - usar mensaje del servidor si existe
          apiError.message = data?.message || data || apiError.message;
      }

      // Si el backend devuelve un string como mensaje de error directo
      if (typeof data === 'string') {
        apiError.message = data;
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      apiError.message = 'No se pudo conectar con el servidor. Verifique su conexión.';
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

/**
 * Tipo de error de API normalizado
 * @typedef {Object} ApiError
 * @property {string} message - Mensaje de error legible
 * @property {number} status - Código de estado HTTP
 * @property {string} [code] - Código de error específico
 * @property {Object} [errors] - Errores de validación detallados
 */

/**
 * Tipo de respuesta de API normalizada
 * @typedef {Object} ApiResponse
 * @property {*} data - Datos de la respuesta
 * @property {string} [message] - Mensaje opcional de la API
 */

export default axiosInstance;