/**
 * Role-Based Access Control (RBAC) Utilities
 *
 * Defines roles, permissions, and helper functions for authorization
 */

// ==================== ROLES ====================
export const ROLES = {
  ADMIN: 'ADMIN',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  COLLABORATOR: 'COLLABORATOR',
};

// ==================== PERMISSIONS ====================
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',

  // Warehouses
  VIEW_WAREHOUSES: 'VIEW_WAREHOUSES',
  CREATE_WAREHOUSE: 'CREATE_WAREHOUSE',
  EDIT_WAREHOUSE: 'EDIT_WAREHOUSE',
  DELETE_WAREHOUSE: 'DELETE_WAREHOUSE',

  // Products
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  EDIT_PRODUCT: 'EDIT_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  UPDATE_STOCK: 'UPDATE_STOCK',

  // Users
  VIEW_USERS: 'VIEW_USERS',
  CREATE_USER: 'CREATE_USER',
  EDIT_USER: 'EDIT_USER',
  DELETE_USER: 'DELETE_USER',

  // Businesses
  VIEW_ALL_BUSINESSES: 'VIEW_ALL_BUSINESSES',
};

// ==================== ROLE PERMISSIONS MAP ====================
const rolePermissions = {
  [ROLES.ADMIN]: [
    // ADMIN tiene TODOS los permisos
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.CREATE_WAREHOUSE,
    PERMISSIONS.EDIT_WAREHOUSE,
    PERMISSIONS.DELETE_WAREHOUSE,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_ALL_BUSINESSES,
  ],

  [ROLES.BUSINESS_OWNER]: [
    // BUSINESS_OWNER gestiona su negocio
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.CREATE_WAREHOUSE,
    PERMISSIONS.EDIT_WAREHOUSE,
    PERMISSIONS.DELETE_WAREHOUSE,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    // NO tiene: VIEW_ALL_BUSINESSES (solo ve su negocio)
  ],

  [ROLES.COLLABORATOR]: [
    // COLLABORATOR solo ve y actualiza stock
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.UPDATE_STOCK,
    // NO puede crear/editar/eliminar nada
  ],
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - Rol del usuario (ADMIN, BUSINESS_OWNER, COLLABORATOR)
 * @param {string} permission - Permiso a verificar
 * @returns {boolean} - true si el rol tiene el permiso
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;

  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Verifica si un rol tiene ALGUNO de los permisos especificados
 * @param {string} role - Rol del usuario
 * @param {string[]} permissions - Array de permisos
 * @returns {boolean} - true si el rol tiene al menos uno de los permisos
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;

  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Verifica si un rol tiene TODOS los permisos especificados
 * @param {string} role - Rol del usuario
 * @param {string[]} permissions - Array de permisos
 * @returns {boolean} - true si el rol tiene todos los permisos
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;

  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Verifica si un usuario es ADMIN
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const isAdmin = (role) => role === ROLES.ADMIN;

/**
 * Verifica si un usuario es BUSINESS_OWNER
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const isBusinessOwner = (role) => role === ROLES.BUSINESS_OWNER;

/**
 * Verifica si un usuario es COLLABORATOR
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const isCollaborator = (role) => role === ROLES.COLLABORATOR;

/**
 * Verifica si un usuario puede gestionar usuarios (crear, editar, eliminar)
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const canManageUsers = (role) => {
  return hasPermission(role, PERMISSIONS.CREATE_USER);
};

/**
 * Verifica si un usuario puede gestionar almacenes (crear, editar, eliminar)
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const canManageWarehouses = (role) => {
  return hasPermission(role, PERMISSIONS.CREATE_WAREHOUSE);
};

/**
 * Verifica si un usuario puede gestionar productos (crear, editar, eliminar)
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export const canManageProducts = (role) => {
  return hasPermission(role, PERMISSIONS.CREATE_PRODUCT);
};

/**
 * Obtiene un label amigable para el rol
 * @param {string} role - Rol del usuario
 * @returns {string} - Label en español
 */
export const getRoleLabel = (role) => {
  const labels = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.BUSINESS_OWNER]: 'Dueño de Negocio',
    [ROLES.COLLABORATOR]: 'Colaborador',
  };

  return labels[role] || 'Desconocido';
};
