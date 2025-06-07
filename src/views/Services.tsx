import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxes, 
  faClipboardList, 
  faChartLine, 
  faExchangeAlt, 
  faUserShield 
} from '@fortawesome/free-solid-svg-icons';

export default function Services() {
  return (
    <div className="relative min-h-screen pt-32 pb-16 bg-gray-50 flex items-center">
      {/* Patrón de fondo */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `radial-gradient(#3b82f620 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mt-12">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todas las funcionalidades que Gestock tiene para tu negocio
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Gestión de inventario */}
          <div className="group bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="text-blue-600 mb-4 transform group-hover:scale-105 transition-transform duration-200 ease-out">
              <FontAwesomeIcon icon={faBoxes} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gestión de inventario
            </h3>
            <p className="text-gray-600">
              Sistema completo para administrar y controlar tu inventario de manera eficiente.
            </p>
          </div>

          {/* Registro y control de productos */}
          <div className="group bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="text-blue-600 mb-4 transform group-hover:scale-105 transition-transform duration-200 ease-out">
              <FontAwesomeIcon icon={faClipboardList} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Registro y control de productos
            </h3>
            <p className="text-gray-600">
              Mantén un registro detallado de todos tus productos y su disponibilidad.
            </p>
          </div>

          {/* Historial de ventas */}
          <div className="group bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="text-blue-600 mb-4 transform group-hover:scale-105 transition-transform duration-200 ease-out">
              <FontAwesomeIcon icon={faChartLine} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Historial de ventas
            </h3>
            <p className="text-gray-600">
              Seguimiento completo de todas las transacciones y análisis de ventas.
            </p>
          </div>

          {/* Control de préstamos y devoluciones */}
          <div className="group bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="text-blue-600 mb-4 transform group-hover:scale-105 transition-transform duration-200 ease-out">
              <FontAwesomeIcon icon={faExchangeAlt} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Control de préstamos y devoluciones
            </h3>
            <p className="text-gray-600">
              Gestiona eficientemente los préstamos y devoluciones de productos.
            </p>
          </div>

          {/* Seguridad y roles de usuario */}
          <div className="group bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="text-blue-600 mb-4 transform group-hover:scale-105 transition-transform duration-200 ease-out">
              <FontAwesomeIcon icon={faUserShield} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Seguridad y roles de usuario
            </h3>
            <p className="text-gray-600">
              Control de acceso y permisos personalizados para tu equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
