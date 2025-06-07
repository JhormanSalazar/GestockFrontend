import { useAuth } from "../../hooks/useAuth";
import { useMenu } from "../../hooks/useMenu";
import { NavLink } from "react-router-dom";

export default function AppHeader() {
  const { isLoggedIn, handleLogoutClick } = useAuth();
  const { menuOpen, menuRef, toggleMenu, closeMenu } = useMenu();

  return (
    <header className="fixed top-0 w-full bg-white z-50">
      <div className="flex justify-between items-center px-6 max-w-7xl mx-auto">
        {/* Ícono menú móvil */}
        <div className="md:hidden flex-1">
          <div onClick={toggleMenu} className="text-3xl cursor-pointer">
            ☰
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <img
            src="/Gestock-Logo-1.svg"
            alt="Gestock Logo"
            className="w-auto h-32 max-md:ml-auto max-md:mr-0"
          />
        </div>

        {/* Menú de navegación md+ */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) => 
              isActive ? 
              "text-blue-600 font-medium py-1 px-3" 
              : "text-[#121116] font-medium hover:text-blue-600 py-1 px-3 transition-all duration-300 transform hover:scale-105"}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => 
              isActive ? 
              "text-blue-600 font-medium py-1 px-3" 
              : "text-[#121116] font-medium hover:text-blue-600 py-1 px-3 transition-all duration-300 transform hover:scale-105"}
          >
            Contacto
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) => 
              isActive ? 
              "text-blue-600 font-medium py-1 px-3" 
              : "text-[#121116] font-medium hover:text-blue-600 py-1 px-3 transition-all duration-300 transform hover:scale-105"}
          >
            Servicios
          </NavLink>
        </nav>

        {/* Botón sesión desktop */}
        <div className="hidden md:flex justify-end">
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-3 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
            >
              Iniciar Sesión
            </NavLink>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-3 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      <div
        ref={menuRef}
        className={`
          md:hidden
          fixed top-0 h-full w-[200px] bg-gray-100 z-50
          px-6 py-8 space-y-6
          transition-all duration-500 ease-in-out
          ${menuOpen ? "left-0" : "-left-[200px]"}
        `}
      >
        {/* Botón cerrar "X" */}
        <div className="flex justify-end mb-4">
          <button
            onClick={closeMenu}
            className="text-2xl font-bold text-gray-700 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <NavLink to="/" className="block text-[#121116] font-medium" onClick={closeMenu}>
          Inicio
        </NavLink>
        <NavLink to="/services" className="block text-[#121116] font-medium" onClick={closeMenu}>
          Servicios
        </NavLink>
        <NavLink to="/contact" className="block text-[#121116] font-medium" onClick={closeMenu}>
          Contacto
        </NavLink>
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium block text-center"
            onClick={closeMenu}
          >
            Iniciar Sesión
          </NavLink>
        ) : (
          <button
            onClick={() => {
              handleLogoutClick();
              closeMenu();
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium w-full"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}
