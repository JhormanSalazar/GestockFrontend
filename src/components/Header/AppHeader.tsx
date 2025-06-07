import Login from "../Login/Login";
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from "../../hooks/useAuth";
import { useMenu } from "../../hooks/useMenu";

export default function AppHeader() {

  const {
    isLoggedIn,
    showLogin,
    setShowLogin,
    handleLoginClick,
    handleLogoutClick,
    handleSimulateAuth,
  } = useAuth();

  const { menuOpen, menuRef, toggleMenu, closeMenu } = useMenu();

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
              className="text-[#121116] font-medium hover:bg-blue-600 hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Inicio
            </a>
            <a
              href="#contacto"
              className="text-[#121116] font-medium hover:bg-blue-600 hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Contacto
            </a>
            <a
              href="#servicios"
              className="text-[#121116] font-medium hover:bg-blue-600 hover:text-white rounded-2xl py-1 px-3 transition-all duration-300 transform hover:scale-105"
            >
              Servicios
            </a>
          </nav>

          {/* Botón sesión desktop */}
          <div className="hidden md:flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-3 rounded-full font-medium cursor-pointer transition-all duration-300 ease"
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
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
            {!isLoggedIn ? "Iniciar Sesión" : "Cerrar Sesión"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Contenedor con animación del contenido */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.30 }}
              className="relative"
            >
              <Login handleSimulateAuth={handleSimulateAuth} />

              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 z-50 text-4xl bg-gray-100 font-semibold rounded-full px-3 py-1 text-red-500 hover:text-red-400 cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
