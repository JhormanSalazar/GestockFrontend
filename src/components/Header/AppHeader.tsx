import { useState, useEffect, useRef } from "react"
import Login from "../Login/Login";

export default function AppHeader() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false)

  // Menu section
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e : MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  //Login section
  const handleLoginClick = () => {
    setShowLogin(true)
    console.log("Iniciando Sesión...")
  }

  const handleLogoutClick = () => {
    setShowLogin(false)
    console.log("Cerrando Sesión...")

  }

  const handleCloseLogin = () => {
    setShowLogin(false)
    console.log("Cerrando Sesión...")
  }

  return (
    <>
      <header className="fixed top-0 w-full bg-white z-50">
        <div className="flex justify-between items-center px-6 max-w-7xl mx-auto">
          {/* Ícono menú móvil */}
          <div className="md:hidden flex-1">
            <div onClick={toggleMenu} className="text-3xl cursor-pointer">
              ☰
            </div>
          </div>

          {/* Logo */}
          <div className=" flex justify-center md:justify-start">
            <img
              src="/Gestock-Logo-1.svg"
              alt="Gestock Logo"
              className="w-auto h-32 max-md:ml-auto max-md:mr-0"
            />
          </div>

          {/* Menú de navegación md+ */}
          <nav className="hidden md:flex justify-center gap-6 mt-2">
            <a
              href="#inicio"
              className="text-[#121116] font-medium hover:bg-[#29AFCE] hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Inicio
            </a>
            <a
              href="#contacto"
              className="text-[#121116] font-medium hover:bg-[#29AFCE] hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Contacto
            </a>
            <a
              href="#servicios"
              className="text-[#121116] font-medium hover:bg-[#29AFCE] hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Servicios
            </a>
          </nav>

          {/* Botón sesión desktop */}
          <div className="hidden md:flex justify-end">
            <button
              className="bg-[#29AFCE] hover:bg-blue-400 text-white text-sm px-4 py-3 rounded-2xl font-medium cursor-pointer transition-all duration-500 ease"
              onClick={!isLoggedIn ? handleLoginClick : handleLogoutClick}
            >
              {!isLoggedIn ? "Iniciar Sesión" : "Cerrar Sesión"}
            </button>
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

          <a href="#inicio" className="block text-[#121116] font-medium">
            Inicio
          </a>
          <a href="#productos" className="block text-[#121116] font-medium">
            Productos
          </a>
          <a href="#contacto" className="block text-[#121116] font-medium">
            Contacto
          </a>
          <button
            className="bg-[#29AFCE] text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {!isLoggedIn ? "Iniciar Sesión" : "Cerrar Sesión"}
          </button>
        </div>
      </header>
    
        {showLogin && (
          <div className="fixed bg-white bg-opacity-20 z-50">
              <Login 
                onClose={handleCloseLogin}
              /> 
          </div>
        )}
    </>
  );
}
