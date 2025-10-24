/**
 * Business Service
 *
 * Servicio para gestión de negocios/empresas.
 * Proporciona operaciones de lectura para business entities.
 *
 * NOTA: La creación de negocios se realiza automáticamente durante el
 * proceso de registro en AuthService.
 *
 * @module BusinessService
 */

import ApiService from './api.service';

class BusinessService extends ApiService {
  constructor() {
    super('/businesses');
  }

  /**
   * Obtiene todos los negocios (requiere rol ADMIN)
   *
   * NOTA: Este endpoint es solo para administradores del sistema.
   * No para administradores de negocio individual.
   *
   * @returns {Promise<Array>} Lista de todos los negocios
   *
   * @example
   * const businesses = await businessService.getAll();
   * // Retorna: [{ id, name }, ...]
   */
  async getAll() {
    try {
      const response = await this.get('');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un negocio específico por ID
   *
   * @param {number} businessId - ID del negocio
   * @returns {Promise<Object>} Datos del negocio
   *
   * @example
   * const business = await businessService.getById(123);
   * // Retorna: { id, name }
   */
  async getById(businessId) {
    try {
      if (!businessId) {
        throw {
          message: 'El ID del negocio es requerido',
          status: 400,
        };
      }

      const response = await this.get(`/${businessId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene el negocio del usuario actual
   *
   * Utiliza el businessId almacenado en localStorage del usuario autenticado.
   *
   * @returns {Promise<Object>} Datos del negocio actual
   *
   * @example
   * const currentBusiness = await businessService.getCurrentBusiness();
   * // Retorna: { id, name }
   */
  async getCurrentBusiness() {
    try {
      // Obtener businessId del localStorage
      const businessId = localStorage.getItem('business_id');

      if (!businessId) {
        throw {
          message: 'No se encontró información del negocio. Por favor, inicie sesión nuevamente.',
          status: 401,
        };
      }

      return await this.getById(parseInt(businessId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un negocio existente
   *
   * NOTA: El backend actual no tiene endpoint PUT para business.
   * Este método está preparado para cuando se implemente.
   *
   * @param {number} businessId - ID del negocio a actualizar
   * @param {Object} businessData - Datos actualizados
   * @param {string} [businessData.name] - Nuevo nombre
   * @returns {Promise<Object>} Negocio actualizado
   *
   * @example
   * const updated = await businessService.update(123, {
   *   name: 'Mi Empresa S.A.S. - Actualizado'
   * });
   */
  async update(businessId, businessData) {
    try {
      if (!businessId) {
        throw {
          message: 'El ID del negocio es requerido',
          status: 400,
        };
      }

      const response = await this.put(`/${businessId}`, businessData);
      return response;
    } catch (error) {
      // Si el backend retorna 404, probablemente el endpoint no existe aún
      if (error.status === 404) {
        throw {
          ...error,
          message: 'El endpoint de actualización no está disponible en el backend',
        };
      }
      throw error;
    }
  }

  /**
   * Valida los datos de un negocio antes de enviarlos al servidor
   *
   * @param {Object} businessData - Datos a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si los datos son válidos
   * @returns {string[]} return.errors - Array de mensajes de error
   *
   * @example
   * const validation = businessService.validateBusinessData({ name: '' });
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  validateBusinessData(businessData) {
    const errors = [];

    if (!businessData.name || businessData.name.trim().length === 0) {
      errors.push('El nombre del negocio es requerido');
    }

    if (businessData.name && businessData.name.length > 100) {
      errors.push('El nombre del negocio no puede exceder 100 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Exportar instancia única (singleton)
const businessService = new BusinessService();

export default businessService;
