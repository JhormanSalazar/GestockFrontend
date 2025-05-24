import { useState } from "react"
import imagenLogo from "../../assets/Imagen-login.svg"

type LoginProps = {
  handleSimulateAuth: (user: string, password: string) => void
} 

export default function Login({ handleSimulateAuth } : LoginProps) {

  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSimulateAuth(user, password)
  }

  return (
    <>
      <form 
          onSubmit={handleSubmit}
          className=" grid grid-cols-2 items-center w-full text-md h-screen "
        >
        <div className="flex flex-col justify-center mx-auto w-[55%] h-auto p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)] gap-y-1">
          <h1 className=" text-5xl font-medium">¡Bienvenido!</h1>
          <p className=" text-[rgb(137,137,137)] font-medium pt-2">
            Por favor Ingresa tus Datos
          </p>

          <label htmlFor="user" className=" pt-6 font-medium text-sm">
            Usuario
          </label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="p-3 mt-1.5 rounded-md border-2 border-gray-300"
          />

          <label htmlFor="password" className=" pt-6 font-medium text-sm">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 mt-1.5 rounded-md border-2 border-gray-300"
          />

          <div className=" flex justify-between items-center pt-6">
            <div>
              <input type="checkbox" id="checkbox"/>
              <label
                htmlFor="checkbox"
                className=" ml-2 cursor-pointer inline justify-center items-center"
              >
                Recordarme
              </label>
            </div>

            <a
              href="#"
              className=" text-purple-800 hover:text-purple-600 cursor-pointer "
            >
              Olvidé mi Contraseña
            </a>
          </div>

          <button
            type="submit"
            className=" mt-6 p-4 bg-[#29AFCE] border-none text-white rounded-md text-sm cursor-pointer transition-all duration-500 ease hover:bg-blue-400 font-medium"
            onClick={handleSubmit}
          >
            Iniciar Sesión
          </button>
        </div>

        <figure>
          <img src={imagenLogo} alt="Imagen-bienvenida" className="flex justify-center items-center w-full h-screen bg-[#2f90a6]" />
        </figure>
      </form>
    </>
  );
}
