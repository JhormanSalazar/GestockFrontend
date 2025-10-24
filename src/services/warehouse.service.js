/**
 * Warehouse Service
 *
 * Servicio para gestión de bodegas/almacenes.
 * Proporciona operaciones CRUD completas para warehouses.
 *
 * @module WarehouseService
 */

import ApiService from './api.service';
import authService from './auth.service';

class WarehouseService extends ApiService {
  constructor() {
    super('/warehouses');
  }

  /**
   * Obtiene todas las bodegas (requiere rol ADMIN)
   *
   * @returns {Promise<Array>} Lista de todas las bodegas del sistema
   *
   * @example
   * const warehouses = await warehouseService.getAll();
   * // Retorna: [{ id, name, businessId, businessName, address }, ...]
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
   * Obtiene una bodega específica por ID
   *
   * @param {number} warehouseId - ID de la bodega
   * @returns {Promise<Object>} Datos de la bodega
   *
   * @example
   * const warehouse = await warehouseService.getById(123);
   * // Retorna: { id, name, businessId, businessName, address }
   */
  async getById(warehouseId) {
    try {
      if (!warehouseId) {
        throw {
          message: 'El ID de la bodega es requerido',
          status: 400,
        };
      }

      const response = await this.get(`/${warehouseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene todas las bodegas de un negocio específico
   *
   * @param {number} [businessId] - ID del negocio (opcional, usa el del usuario actual si no se proporciona)
   * @returns {Promise<Array>} Lista de bodegas del negocio
   *
   * @example
   * // Usar businessId del usuario actual
   * const warehouses = await warehouseService.getByBusinessId();
   *
   * // Especificar un businessId
   * const warehouses = await warehouseService.getByBusinessId(456);
   * // Retorna: [{ id, name, businessId, businessName, address }, ...]
   */
  async getByBusinessId(businessId) {
    try {
      // Si no se proporciona businessId, usar el del usuario actual
      const targetBusinessId = businessId || authService.getBusinessId();

      if (!targetBusinessId) {
        throw {
          message: 'No se pudo determinar el ID del negocio',
          status: 400,
        };
      }

      const response = await this.get(`/by-business/${targetBusinessId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea una nueva bodega
   *
   * @param {Object} warehouseData - Datos de la bodega a crear
   * @param {string} warehouseData.name - Nombre de la bodega
   * @param {string} [warehouseData.address] - Dirección de la bodega (opcional)
   * @param {number} [warehouseData.businessId] - ID del negocio (opcional, usa el del usuario actual si no se proporciona)
   * @returns {Promise<Object>} Bodega creada
   *
   * @example
   * const newWarehouse = await warehouseService.create({
   *   name: 'Bodega Principal',
   *   address: 'Calle 123 #45-67'
   * });
   * // Retorna: { id, name, businessId, businessName, address }
   */
  async create(warehouseData) {
    try {
      // Validar datos requeridos
      if (!warehouseData.name) {
        throw {
          message: 'El nombre de la bodega es requerido',
          status: 400,
        };
      }

      // Si no se proporciona businessId, usar el del usuario actual
      const requestData = {
        ...warehouseData,
        businessId: warehouseData.businessId || authService.getBusinessId(),
      };

      if (!requestData.businessId) {
        throw {
          message: 'No se pudo determinar el ID del negocio',
          status: 400,
        };
      }

      const response = await this.post('', requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza una bodega existente
   *
   * @param {number} warehouseId - ID de la bodega a actualizar
   * @param {Object} warehouseData - Datos actualizados
   * @param {string} [warehouseData.name] - Nuevo nombre
   * @param {string} [warehouseData.address] - Nueva dirección
   * @param {number} [warehouseData.businessId] - Nuevo businessId (generalmente no debería cambiar)
   * @returns {Promise<Object>} Bodega actualizada
   *
   * @example
   * const updated = await warehouseService.update(123, {
   *   name: 'Bodega Principal - Actualizada',
   *   address: 'Nueva dirección'
   * });
   * // Retorna: { id, name, businessId, businessName, address }
   */
  async update(warehouseId, warehouseData) {
    try {
      if (!warehouseId) {
        throw {
          message: 'El ID de la bodega es requerido',
          status: 400,
        };
      }

      // Asegurar que businessId esté presente
      const requestData = {
        ...warehouseData,
        businessId: warehouseData.businessId || authService.getBusinessId(),
      };

      const response = await this.put(`/${warehouseId}`, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Elimina una bodega
   *
   * @param {number} warehouseId - ID de la bodega a eliminar
   * @returns {Promise<void>} Promesa vacía (204 No Content)
   *
   * @example
   * await warehouseService.delete(123);
   */
  async delete(warehouseId) {
    try {
      if (!warehouseId) {
        throw {
          message: 'El ID de la bodega es requerido',
          status: 400,
        };
      }

      await this.api.delete(`${this.baseEndpoint}/${warehouseId}`);
      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida los datos de una bodega antes de enviarlos al servidor
   *
   * @param {Object} warehouseData - Datos a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si los datos son válidos
   * @returns {string[]} return.errors - Array de mensajes de error
   *
   * @example
   * const validation = warehouseService.validateWarehouseData({ name: '' });
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  validateWarehouseData(warehouseData) {
    const errors = [];

    if (!warehouseData.name || warehouseData.name.trim().length === 0) {
      errors.push('El nombre de la bodega es requerido');
    }

    if (warehouseData.name && warehouseData.name.length > 100) {
      errors.push('El nombre de la bodega no puede exceder 100 caracteres');
    }

    if (warehouseData.address && warehouseData.address.length > 200) {
      errors.push('La dirección no puede exceder 200 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Exportar instancia única (singleton)
const warehouseService = new WarehouseService();

export default warehouseService;
