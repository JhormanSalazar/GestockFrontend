/**
 * Services Index
 *
 * Exportación centralizada de todos los servicios de la aplicación.
 * Facilita las importaciones en los componentes.
 *
 * @example
 * // Importar un servicio específico
 * import { authService, productService } from '@/services';
 *
 * // O importar todos
 * import * as services from '@/services';
 */

export { default as authService } from './auth.service';
export { default as warehouseService } from './warehouse.service';
export { default as productService } from './product.service';
export { default as businessService } from './business.service';
export { default as userService } from './user.service';
export { default as warehouseProductService } from './warehouseProduct.service';
export { default as ApiService } from './api.service';
