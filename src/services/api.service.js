/**
 * Base API Service Class
 *
 * Clase base que proporciona métodos HTTP genéricos para todos los servicios.
 * Todos los servicios específicos pueden extender esta clase para heredar
 * funcionalidad común de peticiones HTTP.
 *
 * @class ApiService
 */

import axiosInstance from '@/config/axios.config';

class ApiService {
  /**
   * Constructor de la clase base
   * @param {string} baseEndpoint - Endpoint base para el recurso (ej: '/products')
   */
  constructor(baseEndpoint = '') {
    this.baseEndpoint = baseEndpoint;
    this.api = axiosInstance;
  }

  /**
   * Realiza una petición GET
   *
   * @param {string} endpoint - Ruta específica del endpoint (se concatena con baseEndpoint)
   * @param {Object} config - Configuración adicional de Axios (params, headers, etc.)
   * @returns {Promise<any>} Respuesta del servidor
   *
   * @example
   * const response = await this.get('/list', { params: { page: 1 } });
   */
  async get(endpoint = '', config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Realiza una petición POST
   *
   * @param {string} endpoint - Ruta específica del endpoint
   * @param {Object} data - Datos a enviar en el body
   * @param {Object} config - Configuración adicional de Axios
   * @returns {Promise<any>} Respuesta del servidor
   *
   * @example
   * const response = await this.post('', { name: 'Product', price: 100 });
   */
  async post(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Realiza una petición PUT
   *
   * @param {string} endpoint - Ruta específica del endpoint
   * @param {Object} data - Datos a enviar en el body
   * @param {Object} config - Configuración adicional de Axios
   * @returns {Promise<any>} Respuesta del servidor
   *
   * @example
   * const response = await this.put('/123', { name: 'Updated Product' });
   */
  async put(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Realiza una petición PATCH
   *
   * @param {string} endpoint - Ruta específica del endpoint
   * @param {Object} data - Datos a enviar en el body
   * @param {Object} config - Configuración adicional de Axios
   * @returns {Promise<any>} Respuesta del servidor
   *
   * @example
   * const response = await this.patch('/123', { price: 150 });
   */
  async patch(endpoint = '', data = {}, config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Realiza una petición DELETE
   *
   * @param {string} endpoint - Ruta específica del endpoint
   * @param {Object} config - Configuración adicional de Axios
   * @returns {Promise<any>} Respuesta del servidor (usualmente vacía en 204)
   *
   * @example
   * await this.delete('/123');
   */
  async delete(endpoint = '', config = {}) {
    try {
      const url = this.buildUrl(endpoint);
      const response = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Construye la URL completa concatenando baseEndpoint con endpoint específico
   *
   * @private
   * @param {string} endpoint - Endpoint específico
   * @returns {string} URL completa
   */
  buildUrl(endpoint) {
    // Asegurar que no haya doble slash
    const base = this.baseEndpoint.endsWith('/')
      ? this.baseEndpoint.slice(0, -1)
      : this.baseEndpoint;

    const path = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

    return `${base}${path}`;
  }

  /**
   * Maneja errores de forma consistente
   *
   * @private
   * @param {Object} error - Error capturado
   * @returns {Object} Error normalizado
   */
  handleError(error) {
    // Si el error ya fue procesado por el interceptor de Axios, simplemente lo relanzamos
    if (error.message && error.status !== undefined) {
      return error;
    }

    // Si es un error no procesado, lo normalizamos
    return {
      message: error.message || 'Error desconocido en la petición',
      status: error.response?.status || 500,
      code: error.code,
    };
  }
}

export default ApiService;