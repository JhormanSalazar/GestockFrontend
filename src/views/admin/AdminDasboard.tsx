import { FiUsers, FiPackage, FiPlusCircle } from "react-icons/fi";

export default function AdminDasboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Panel de Administración</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* User Management Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <FiUsers className="text-blue-600 text-xl sm:text-2xl mr-3" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 mb-4">
                  <div>
                    <h3 className="font-medium">Juan Pérez</h3>
                    <p className="text-sm text-gray-500">juan@example.com</p>
                  </div>
                  <select className="w-full sm:w-auto form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Empleado</option>
                    <option>Administrador</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                  <div>
                    <h3 className="font-medium">María García</h3>
                    <p className="text-sm text-gray-500">maria@example.com</p>
                  </div>
                  <select className="w-full sm:w-auto form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Administrador</option>
                    <option>Empleado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Management Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
              <div className="flex items-center">
                <FiPackage className="text-green-600 text-xl sm:text-2xl mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Gestión de Productos</h2>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FiPlusCircle className="mr-2" />
                Añadir Producto
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg mb-3"></div>
                  <h3 className="font-medium">Producto 1</h3>
                  <p className="text-sm text-gray-500">Stock: 50</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg mb-3"></div>
                  <h3 className="font-medium">Producto 2</h3>
                  <p className="text-sm text-gray-500">Stock: 30</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg mb-3"></div>
                  <h3 className="font-medium">Producto 3</h3>
                  <p className="text-sm text-gray-500">Stock: 15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
