/**
 * User Service
 *
 * Servicio para gestión de usuarios.
 * Proporciona operaciones CRUD para users.
 *
 * NOTA: La mayoría de operaciones requieren rol ADMIN.
 * El registro de usuarios se realiza a través de AuthService.
 *
 * @module UserService
 */

import ApiService from './api.service';

class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  /**
   * Obtiene todos los usuarios (requiere rol ADMIN)
   *
   * @returns {Promise<Array>} Lista de todos los usuarios
   *
   * @example
   * const users = await userService.getAll();
   * // Retorna: [{ id, email, businessName, roleName }, ...]
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
   * Obtiene un usuario específico por ID (requiere rol ADMIN)
   *
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   *
   * @example
   * const user = await userService.getById(123);
   * // Retorna: { id, email, businessName, roleName }
   */
  async getById(userId) {
    try {
      if (!userId) {
        throw {
          message: 'El ID del usuario es requerido',
          status: 400,
        };
      }

      const response = await this.get(`/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   *
   * NOTA: Este método recibe un User entity completo, no un DTO.
   * Considera usar AuthService.register() para el registro normal de usuarios.
   *
   * @param {Object} userData - Datos del usuario a crear (User entity)
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña (será encriptada por el backend)
   * @param {Object} userData.business - Objeto Business asociado
   * @param {Object} userData.role - Objeto Role asociado
   * @returns {Promise<Object>} Usuario creado (User entity completo)
   *
   * @example
   * // Este método es más adecuado para creación programática de usuarios
   * // Para registro normal, usar AuthService.register()
   */
  async create(userData) {
    try {
      // Validar datos requeridos
      if (!userData.email) {
        throw {
          message: 'El email del usuario es requerido',
          status: 400,
        };
      }

      if (!userData.password) {
        throw {
          message: 'La contraseña del usuario es requerida',
          status: 400,
        };
      }

      const response = await this.post('', userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   *
   * NOTA: El backend actual no tiene endpoint PUT para users.
   * Este método está preparado para cuando se implemente.
   *
   * @param {number} userId - ID del usuario a actualizar
   * @param {Object} userData - Datos actualizados
   * @param {string} [userData.email] - Nuevo email
   * @param {string} [userData.password] - Nueva contraseña
   * @returns {Promise<Object>} Usuario actualizado
   *
   * @example
   * const updated = await userService.update(123, {
   *   email: 'newemail@example.com'
   * });
   */
  async update(userId, userData) {
    try {
      if (!userId) {
        throw {
          message: 'El ID del usuario es requerido',
          status: 400,
        };
      }

      const response = await this.put(`/${userId}`, userData);
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
   * Elimina un usuario
   *
   * NOTA: El backend actual no tiene endpoint DELETE para users.
   * Este método está preparado para cuando se implemente.
   *
   * @param {number} userId - ID del usuario a eliminar
   * @returns {Promise<void>} Promesa vacía (204 No Content)
   *
   * @example
   * await userService.delete(123);
   */
  async delete(userId) {
    try {
      if (!userId) {
        throw {
          message: 'El ID del usuario es requerido',
          status: 400,
        };
      }

      await this.api.delete(`${this.baseEndpoint}/${userId}`);
      return;
    } catch (error) {
      // Si el backend retorna 404, probablemente el endpoint no existe aún
      if (error.status === 404) {
        throw {
          ...error,
          message: 'El endpoint de eliminación no está disponible en el backend',
        };
      }
      throw error;
    }
  }

  /**
   * Obtiene los usuarios de un negocio específico (filtrado local)
   *
   * NOTA: El backend no tiene endpoint específico para esto,
   * por lo que se realiza filtrado en el cliente.
   *
   * @param {number} businessId - ID del negocio
   * @param {Array} [users] - Lista de usuarios donde filtrar (opcional)
   * @returns {Promise<Array>} Lista de usuarios del negocio
   *
   * @example
   * const businessUsers = await userService.getByBusinessId(456);
   */
  async getByBusinessId(businessId, users = null) {
    try {
      const userList = users || await this.getAll();

      // El DTO no incluye businessId directamente, solo businessName
      // Esto es una limitación del backend actual
      // Por ahora, no podemos filtrar por businessId del lado del cliente
      console.warn('El backend no retorna businessId en UserResponseDto, no se puede filtrar');

      return userList;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida los datos de un usuario antes de enviarlos al servidor
   *
   * @param {Object} userData - Datos a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si los datos son válidos
   * @returns {string[]} return.errors - Array de mensajes de error
   *
   * @example
   * const validation = userService.validateUserData({ email: 'invalid' });
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  validateUserData(userData) {
    const errors = [];

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('El email del usuario es requerido');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      errors.push('El formato del email no es válido');
    }

    if (!userData.password || userData.password.trim().length === 0) {
      errors.push('La contraseña del usuario es requerida');
    }

    if (userData.password && userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Exportar instancia única (singleton)
const userService = new UserService();

export default userService;
