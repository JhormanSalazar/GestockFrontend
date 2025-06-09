import { FaUser, FaBell } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminHeader() {
  const { isLoggedIn, handleLogoutClick } = useAuth();
  const [notifications] = useState(1); 

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          {/* Logo Section */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            <img
              src="/Gestock-Logo-1.svg"
              alt="Gestock Logo"
              className="h-20 sm:h-28 w-auto"
            />
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            {/* Mobile Logout Button */}
            {isLoggedIn && (
              <button
                onClick={handleLogoutClick}
                className="sm:hidden w-full bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
              >
                Cerrar Sesión
              </button>
            )}

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaBell className="text-gray-600 text-lg sm:text-xl" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-gray-800">
                    Administrador
                  </p>
                  <p className="text-xs text-gray-500">Panel de Control</p>
                </div>
                {/* Profile Icon */}
                <div className="flex items-center">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaUser className="text-blue-600 text-lg sm:text-xl" />
                  </button>
                </div>
                {/* Desktop Logout Button */}
                {isLoggedIn && (
                  <button
                    onClick={handleLogoutClick}
                    className="hidden sm:block bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
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
