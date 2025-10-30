import ApiService from './api.service';
import authService from './auth.service';

class WarehouseProductService extends ApiService {
  constructor() {
    super('/warehouse-products');
  }

  /**
   * Obtiene todos los productos en almacenes del negocio del usuario actual
   *
   * @returns {Promise<Array>} Lista de productos con su stock por almacén
   *
   * @example
   * const warehouseProducts = await warehouseProductService.getByBusiness();
   * // Retorna: [{ productId, warehouseId, stock, productName, warehouseName }, ...]
   */
  async getByBusiness() {
    try {
      const response = await this.get('/by-business');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene todos los productos de un almacén específico
   *
   * @param {number} warehouseId - ID del almacén
   * @returns {Promise<Array>} Lista de productos en el almacén con su stock
   *
   * @example
   * const products = await warehouseProductService.getByWarehouse(123);
   * // Retorna: [{ productId, warehouseId, stock, productName, price, sku }, ...]
   */
  async getByWarehouse(warehouseId) {
    try {
      if (!warehouseId) {
        throw {
          message: 'El ID del almacén es requerido',
          status: 400,
        };
      }

      const response = await this.get(`/by-warehouse/${warehouseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un producto específico en un almacén específico
   *
   * @param {number} productId - ID del producto
   * @param {number} warehouseId - ID del almacén
   * @returns {Promise<Object>} Datos del producto en el almacén
   *
   * @example
   * const warehouseProduct = await warehouseProductService.getById(123, 456);
   * // Retorna: { productId, warehouseId, stock, productName, warehouseName }
   */
  async getById(productId, warehouseId) {
    try {
      if (!productId || !warehouseId) {
        throw {
          message: 'El ID del producto y del almacén son requeridos',
          status: 400,
        };
      }

      const response = await this.get(`/${productId}/${warehouseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo producto en un almacén (asigna stock inicial)
   *
   * @param {Object} data - Datos del producto en almacén
   * @param {number} data.productId - ID del producto
   * @param {number} data.warehouseId - ID del almacén
   * @param {number} data.quantity - Cantidad inicial de stock
   * @returns {Promise<Object>} Producto creado en el almacén
   *
   * @example
   * const created = await warehouseProductService.create({
   *   productId: 123,
   *   warehouseId: 456,
   *   quantity: 100
   * });
   */
  async create(data) {
    try {
      if (!data.productId || !data.warehouseId) {
        throw {
          message: 'El ID del producto y del almacén son requeridos',
          status: 400,
        };
      }

      if (data.quantity === undefined || data.quantity === null) {
        throw {
          message: 'La cantidad es requerida',
          status: 400,
        };
      }

      const response = await this.post('', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza el stock de un producto en un almacén
   *
   * @param {number} productId - ID del producto
   * @param {number} warehouseId - ID del almacén
   * @param {Object} data - Datos actualizados
   * @param {number} data.quantity - Nueva cantidad de stock
   * @returns {Promise<Object>} Producto actualizado
   *
   * @example
   * const updated = await warehouseProductService.update(123, 456, { quantity: 200 });
   */
  async update(productId, warehouseId, data) {
    try {
      if (!productId || !warehouseId) {
        throw {
          message: 'El ID del producto y del almacén son requeridos',
          status: 400,
        };
      }

      const response = await this.put(`/${productId}/${warehouseId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Elimina un producto de un almacén
   *
   * @param {number} productId - ID del producto
   * @param {number} warehouseId - ID del almacén
   * @returns {Promise<void>} Promesa vacía (204 No Content)
   *
   * @example
   * await warehouseProductService.delete(123, 456);
   */
  async delete(productId, warehouseId) {
    try {
      if (!productId || !warehouseId) {
        throw {
          message: 'El ID del producto y del almacén son requeridos',
          status: 400,
        };
      }

      await this.api.delete(`${this.baseEndpoint}/${productId}/${warehouseId}`);
      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida los datos de un producto en almacén antes de enviarlos al servidor
   *
   * @param {Object} data - Datos a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si los datos son válidos
   * @returns {string[]} return.errors - Array de mensajes de error
   */
  validateWarehouseProductData(data) {
    const errors = [];

    if (!data.productId) {
      errors.push('El ID del producto es requerido');
    }

    if (!data.warehouseId) {
      errors.push('El ID del almacén es requerido');
    }

    if (data.quantity === undefined || data.quantity === null) {
      errors.push('La cantidad es requerida');
    }

    if (typeof data.quantity === 'number' && data.quantity < 0) {
      errors.push('La cantidad no puede ser negativa');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Exportar instancia única (singleton)
const warehouseProductService = new WarehouseProductService();

export default warehouseProductService;
