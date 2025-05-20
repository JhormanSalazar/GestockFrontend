import { useState } from "react";

export default function AppHeader() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false) 

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev) //Toma el valor más actualizado del state e invierte el valor
  }
  
  return (
    <header className="fixed top-0 w-full bg-white z-50">
      <div className=" flex justify-between items-center px-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <img
            src="/Gestock-Logo-1.svg"
            alt="Gestock Logo"
            className="w-auto h-32 max-md:mx-auto max-md:my-0"
          />
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-6 m-0 p-0 list-none ">
            <li>
              <a
                href="#inicio"
                className="no-underline text-[#121116] font-medium hover:bg-black hover:text-white rounded-2xl py-1 px-3 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#contacto"
                className="no-underline text-[#121116] font-medium hover:bg-black hover:text-white rounded-2xl py-1 px-3 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Contacto
              </a>
            </li>
            <li>
              <a
                href="#servicios"
                className="no-underline text-[#121116] font-medium hover:bg-black hover:text-white rounded-2xl py-1 px-3 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Servicios
              </a>
            </li>
          </ul>
        </nav>

        <button
          onClick={toggleLogin}
          className="hidden md:block bg-[#29AFCE] hover:bg-blue-400 text-white px-4 py-3 rounded-2xl cursor-pointer font-medium"
        >
          {!isLoggedIn ? "Iniciar Sesión" : "Cerrar Sesión"}
        </button>
      </div>

      {/* Icono menú móvil */}
      {/* TODO: Fix responsive */}
      <div className="md:hidden text-2xl cursor-pointer">☰</div>

      {/* Menú móvil desplegable */}
      <div className="flex flex-col md:hidden bg-gray-100 px-6 py-4 space-y-3">
        <a href="#inicio" className="text-gray-800 font-medium">
          Inicio
        </a>
        <a href="#productos" className="text-gray-800 font-medium">
          Productos
        </a>
        <a href="#contacto" className="text-gray-800 font-medium">
          Contacto
        </a>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm w-fit">
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
}
