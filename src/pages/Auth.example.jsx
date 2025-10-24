/**
 * EJEMPLO DE COMPONENTE AUTH MIGRADO
 *
 * Este es un ejemplo de cómo el componente Auth.jsx debería verse
 * después de migrar de Supabase al backend Spring Boot.
 *
 * INSTRUCCIONES:
 * 1. Revisar este archivo como referencia
 * 2. Adaptar Auth.jsx existente con esta estructura
 * 3. Usar tus propios componentes UI (shadcn/ui)
 * 4. Mantener el diseño visual que ya tienes
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schemas de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = z.object({
  businessName: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function AuthExample() {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const { loginMutation, registerMutation, isLoggingIn, isRegistering } = useAuth();

  // Formulario de Login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Formulario de Registro
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handler de Login
  const handleLogin = (data) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  // Handler de Registro
  const handleRegister = (data) => {
    registerMutation.mutate(
      {
        businessName: data.businessName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          // Después del registro exitoso, cambiar a modo login
          setMode('login');
          // Opcional: Prellenar el email en el formulario de login
          loginForm.setValue('email', data.email);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestock</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión de Inventario</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              mode === 'login'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            } rounded-l-lg transition-colors`}
            onClick={() => setMode('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              mode === 'register'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            } rounded-r-lg transition-colors`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...loginForm.register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                {...loginForm.register('password')}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                {...registerForm.register('businessName')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mi Empresa S.A.S."
              />
              {registerForm.formState.errors.businessName && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...registerForm.register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@empresa.com"
              />
              {registerForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                {...registerForm.register('password')}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                {...registerForm.register('confirmPassword')}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isRegistering ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-500 hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-500 hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
