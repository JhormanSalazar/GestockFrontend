import { FaUser, FaBell } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminHeader() {
  
  const { isLoggedIn, handleLogoutClick } = useAuth();

  const [notifications] = useState(1); // Example notification count

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title Section */}
          
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
              <img
                src="/Gestock-Logo-1.svg"
                alt="Gestock Logo"
                className="w-auto h-28 max-md:ml-auto max-md:mr-0"
              />
            </div>


          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaBell className="text-gray-600 text-xl" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">
                  Administrador
                </p>
                <p className="text-xs text-gray-500">Panel de Control</p>
              </div>
              {/* Icono perfil */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaUser className="text-blue-600 text-xl" />
                </button>
              </div>
              {/* Botón sesión desktop */}
              <div className="hidden md:flex justify-end">
                {isLoggedIn && (
                  <button
                    onClick={handleLogoutClick}
                    className="bg-red-600 hover:bg-red-500 text-white text-sm px-2 py-3 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
