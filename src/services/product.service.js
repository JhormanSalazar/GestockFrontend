/**
 * Product Service
 *
 * Servicio para gestión de productos del catálogo.
 * Proporciona operaciones CRUD completas para products.
 *
 * IMPORTANTE: Los productos están vinculados a un negocio específico (businessId).
 * El stock se maneja a través de la relación WarehouseProduct.
 *
 * @module ProductService
 */

import ApiService from './api.service';
import authService from './auth.service';

class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  /**
   * Obtiene todos los productos del negocio actual
   *
   * @param {number} [businessId] - ID del negocio (opcional, usa el del usuario si no se proporciona)
   * @returns {Promise<Array>} Lista de productos del negocio
   *
   * @example
   * const products = await productService.getByBusinessId();
   * // Retorna: [{ id, name, price, description }, ...]
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
   * Obtiene un producto específico por ID
   *
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Datos del producto
   *
   * @example
   * const product = await productService.getById(123);
   * // Retorna: { id, name, price, description }
   */
  async getById(productId) {
    try {
      if (!productId) {
        throw {
          message: 'El ID del producto es requerido',
          status: 400,
        };
      }

      const response = await this.get(`/${productId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo producto (requiere rol ADMIN o BUSINESS_OWNER)
   *
   * @param {Object} productData - Datos del producto a crear
   * @param {string} productData.name - Nombre del producto
   * @param {number} productData.price - Precio del producto
   * @param {string} [productData.description] - Descripción del producto (opcional)
   * @returns {Promise<Object>} Producto creado
   *
   * @example
   * const newProduct = await productService.create({
   *   name: 'Laptop HP',
   *   price: 1500000,
   *   description: 'Laptop HP 15.6" Intel i5'
   * });
   * // Retorna: Product entity completo (puede incluir relaciones)
   */
  async create(productData) {
    try {
      // Validar datos requeridos
      if (!productData.name) {
        throw {
          message: 'El nombre del producto es requerido',
          status: 400,
        };
      }

      if (productData.price === undefined || productData.price === null) {
        throw {
          message: 'El precio del producto es requerido',
          status: 400,
        };
      }

      if (productData.price < 0) {
        throw {
          message: 'El precio del producto no puede ser negativo',
          status: 400,
        };
      }

      // Si no se proporciona businessId, usar el del usuario actual
      const requestData = {
        ...productData,
        businessId: productData.businessId || authService.getBusinessId(),
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
   * Actualiza un producto existente
   *
   * @param {number} productId - ID del producto a actualizar
   * @param {Object} productData - Datos actualizados
   * @param {string} [productData.name] - Nuevo nombre
   * @param {number} [productData.price] - Nuevo precio
   * @param {string} [productData.description] - Nueva descripción
   * @returns {Promise<Object>} Producto actualizado
   *
   * @example
   * const updated = await productService.update(123, {
   *   name: 'Laptop HP - Actualizado',
   *   price: 1600000
   * });
   */
  async update(productId, productData) {
    try {
      if (!productId) {
        throw {
          message: 'El ID del producto es requerido',
          status: 400,
        };
      }

      // Validar precio si se proporciona
      if (productData.price !== undefined && productData.price < 0) {
        throw {
          message: 'El precio del producto no puede ser negativo',
          status: 400,
        };
      }

      // Si no se proporciona businessId, usar el del usuario actual
      const requestData = {
        ...productData,
        businessId: productData.businessId || authService.getBusinessId(),
      };

      const response = await this.put(`/${productId}`, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Elimina un producto
   *
   * @param {number} productId - ID del producto a eliminar
   * @returns {Promise<void>} Promesa vacía (204 No Content)
   *
   * @example
   * await productService.delete(123);
   */
  async delete(productId) {
    try {
      if (!productId) {
        throw {
          message: 'El ID del producto es requerido',
          status: 400,
        };
      }

      await this.api.delete(`${this.baseEndpoint}/${productId}`);
      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca productos por nombre (búsqueda local en el cliente)
   *
   * NOTA: Esta es una búsqueda del lado del cliente. Para búsqueda del lado
   * del servidor, se debe implementar un endpoint específico en el backend.
   *
   * @param {string} searchTerm - Término de búsqueda
   * @param {Array} [products] - Lista de productos donde buscar (opcional, obtiene todos si no se proporciona)
   * @param {number} [businessId] - ID del negocio (opcional)
   * @returns {Promise<Array>} Lista de productos que coinciden con la búsqueda
   *
   * @example
   * const results = await productService.search('Laptop');
   * // Retorna productos que contienen 'Laptop' en su nombre o descripción
   */
  async search(searchTerm, products = null, businessId = null) {
    try {
      // Si no se proporcionan productos, obtenerlos primero
      const productList = products || await this.getByBusinessId(businessId);

      if (!searchTerm || searchTerm.trim().length === 0) {
        return productList;
      }

      const term = searchTerm.toLowerCase();

      return productList.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(term);
        const descMatch = product.description?.toLowerCase().includes(term);
        return nameMatch || descMatch;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Filtra productos por rango de precio (filtrado local en el cliente)
   *
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @param {Array} [products] - Lista de productos donde filtrar (opcional)
   * @param {number} [businessId] - ID del negocio (opcional)
   * @returns {Promise<Array>} Lista de productos dentro del rango de precio
   *
   * @example
   * const filtered = await productService.filterByPriceRange(100000, 500000);
   * // Retorna productos con precio entre 100,000 y 500,000
   */
  async filterByPriceRange(minPrice, maxPrice, products = null, businessId = null) {
    try {
      const productList = products || await this.getByBusinessId(businessId);

      return productList.filter(product => {
        const price = product.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida los datos de un producto antes de enviarlos al servidor
   *
   * @param {Object} productData - Datos a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si los datos son válidos
   * @returns {string[]} return.errors - Array de mensajes de error
   *
   * @example
   * const validation = productService.validateProductData({ name: '', price: -100 });
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  validateProductData(productData) {
    const errors = [];

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('El nombre del producto es requerido');
    }

    if (productData.name && productData.name.length > 100) {
      errors.push('El nombre del producto no puede exceder 100 caracteres');
    }

    if (productData.price === undefined || productData.price === null) {
      errors.push('El precio del producto es requerido');
    }

    if (productData.price !== undefined && productData.price < 0) {
      errors.push('El precio del producto no puede ser negativo');
    }

    if (productData.description && productData.description.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Formatea el precio para visualización
   *
   * @param {number} price - Precio a formatear
   * @param {string} [currency='COP'] - Código de moneda (ISO 4217)
   * @returns {string} Precio formateado
   *
   * @example
   * const formatted = productService.formatPrice(1500000);
   * // Retorna: "$1,500,000"
   */
  formatPrice(price, currency = 'COP') {
    try {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(price);
    } catch (error) {
      return `$${price.toLocaleString()}`;
    }
  }
}

// Exportar instancia única (singleton)
const productService = new ProductService();

export default productService;
