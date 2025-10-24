/**
 * Authentication Service
 *
 * Servicio para manejo de autenticación y registro de usuarios.
 * Gestiona tokens JWT y datos de usuario en localStorage.
 *
 * @module AuthService
 */

import ApiService from './api.service';

class AuthService extends ApiService {
  constructor() {
    super('/auth');
  }

  /**
   * Registra un nuevo usuario y negocio
   *
   * @param {Object} registerData - Datos de registro
   * @param {string} registerData.businessName - Nombre del negocio a crear
   * @param {string} registerData.email - Email del usuario
   * @param {string} registerData.password - Contraseña del usuario
   * @returns {Promise<string>} Mensaje de confirmación del servidor
   *
   * @example
   * const message = await authService.register({
   *   businessName: 'Mi Empresa SAS',
   *   email: 'admin@empresa.com',
   *   password: 'securePassword123'
   * });
   */
  async register(registerData) {
    try {
      const response = await this.post('/register', registerData);

      // El backend devuelve un string de confirmación
      // No se guarda sesión automáticamente, el usuario debe hacer login
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inicia sesión de usuario
   *
   * @param {Object} credentials - Credenciales de acceso
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario autenticado
   *
   * @example
   * const user = await authService.login({
   *   email: 'admin@empresa.com',
   *   password: 'securePassword123'
   * });
   * // Retorna: { id, email, jwt, businessId, role }
   */
  async login(credentials) {
    try {
      const response = await this.post('/login', credentials);

      // Validar que la respuesta tenga la estructura esperada
      if (!response.jwt || !response.id) {
        throw {
          message: 'Respuesta inválida del servidor',
          status: 500,
        };
      }

      // Guardar token y datos de usuario en localStorage
      this.saveSession(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   *
   * Limpia el token JWT y los datos del usuario del localStorage.
   * No requiere comunicación con el backend (JWT es stateless).
   *
   * @returns {void}
   *
   * @example
   * authService.logout();
   */
  logout() {
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Opcional: Limpiar otros datos relacionados con la sesión
    localStorage.removeItem('business_id');
  }

  /**
   * Obtiene el token JWT almacenado
   *
   * @returns {string|null} Token JWT o null si no existe
   *
   * @example
   * const token = authService.getToken();
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Obtiene los datos del usuario autenticado
   *
   * @returns {Object|null} Datos del usuario o null si no existe sesión
   *
   * @example
   * const user = authService.getCurrentUser();
   * // Retorna: { id, email, businessId, role }
   */
  getCurrentUser() {
    const userDataString = localStorage.getItem('user_data');

    if (!userDataString) {
      return null;
    }

    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa
   *
   * @returns {boolean} True si existe token, false en caso contrario
   *
   * @example
   * if (authService.isAuthenticated()) {
   *   // Usuario autenticado
   * }
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Obtiene el businessId del usuario actual
   *
   * @returns {number|null} ID del negocio o null si no existe sesión
   *
   * @example
   * const businessId = authService.getBusinessId();
   */
  getBusinessId() {
    const user = this.getCurrentUser();
    return user?.businessId || null;
  }

  /**
   * Obtiene el rol del usuario actual
   *
   * @returns {string|null} Rol del usuario o null si no existe sesión
   *
   * @example
   * const role = authService.getUserRole();
   * // Retorna: 'ADMIN' o 'USER'
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  /**
   * Verifica si el usuario actual es administrador
   *
   * @returns {boolean} True si es ADMIN, false en caso contrario
   *
   * @example
   * if (authService.isAdmin()) {
   *   // Mostrar opciones de administrador
   * }
   */
  isAdmin() {
    const role = this.getUserRole();
    return role === 'ADMIN';
  }

  /**
   * Guarda la sesión en localStorage
   *
   * @private
   * @param {Object} authResponse - Respuesta de autenticación del servidor
   * @param {string} authResponse.jwt - Token JWT
   * @param {number} authResponse.id - ID del usuario
   * @param {string} authResponse.email - Email del usuario
   * @param {number} authResponse.businessId - ID del negocio
   * @param {string} authResponse.role - Rol del usuario
   */
  saveSession(authResponse) {
    // Guardar token
    localStorage.setItem('auth_token', authResponse.jwt);

    // Guardar datos del usuario (sin el token por seguridad)
    const userData = {
      id: authResponse.id,
      email: authResponse.email,
      businessId: authResponse.businessId,
      role: authResponse.role,
    };

    localStorage.setItem('user_data', JSON.stringify(userData));

    // Guardar businessId por separado para acceso rápido
    localStorage.setItem('business_id', authResponse.businessId.toString());
  }

  /**
   * Valida el formato de email
   *
   * @param {string} email - Email a validar
   * @returns {boolean} True si el email es válido
   *
   * @example
   * if (authService.validateEmail('test@example.com')) {
   *   // Email válido
   * }
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida la fortaleza de la contraseña
   *
   * @param {string} password - Contraseña a validar
   * @returns {Object} Resultado de validación
   * @returns {boolean} return.isValid - True si la contraseña es válida
   * @returns {string[]} return.errors - Array de mensajes de error
   *
   * @example
   * const validation = authService.validatePassword('myPassword123');
   * if (!validation.isValid) {
   *   console.log(validation.errors);
   * }
   */
  validatePassword(password) {
    const errors = [];

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Exportar instancia única (singleton)
const authService = new AuthService();

export default authService;
