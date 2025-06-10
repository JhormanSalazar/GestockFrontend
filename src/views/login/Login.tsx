import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { LoginSchema } from "../../types/login";
import imagenLogo from "../../assets/Imagen-login.svg";
import { useAuth } from "../../hooks/useAuth";
import loginSchema from "../../schemas/loginSchema";

export default function Login() {
  // React router
  const navigate = useNavigate();

  // Auth hook
  const { handleSimulateAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    handleSimulateAuth(data.email, data.password);
  };
  
  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-2xl bg-gray-100 hover:bg-gray-200 font-semibold rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-2">
              ¡Bienvenido!
            </h1>
            <p className="text-gray-500 font-medium mb-8">
              Por favor ingresa tus datos
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Usuario
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm pt-4 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  placeholder="********"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm pt-4 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  >
                    Recordarme
                  </label>
                </div>

                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-150"
                >
                  Olvidé mi contraseña
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src={imagenLogo}
            alt="Imagen de bienvenida"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
