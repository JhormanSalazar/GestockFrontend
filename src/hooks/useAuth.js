/**
 * useAuth Hook
 *
 * Custom hook para manejo de autenticación con React Query.
 * Proporciona funciones para login, register, logout y estado de autenticación.
 *
 * @module useAuth
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook de autenticación
 *
 * @returns {Object} Métodos y estados de autenticación
 *
 * @example
 * function LoginForm() {
 *   const { loginMutation, registerMutation, logout, isAuthenticated } = useAuth();
 *
 *   const handleLogin = () => {
 *     loginMutation.mutate({ email: 'user@example.com', password: 'pass123' });
 *   };
 *
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Mutation para login de usuario
   */
  const loginMutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Invalidar todas las queries para refrescar con el nuevo contexto de usuario
      queryClient.invalidateQueries();

      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido, ${data.email}`,
      });

      // Redirigir al dashboard
      navigate('/');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: error.message || 'Credenciales inválidas',
      });
    },
  });

  /**
   * Mutation para registro de usuario y negocio
   */
  const registerMutation = useMutation({
    mutationFn: (registerData) => authService.register(registerData),
    onSuccess: (message) => {
      toast({
        title: 'Registro exitoso',
        description: message || 'Usuario registrado. Por favor, inicie sesión.',
      });

      // Redirigir a login después del registro
      // Como el backend no devuelve token en register, el usuario debe hacer login
      // Opcional: Podrías quedarte en la misma página y cambiar a modo "login"
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al registrarse',
        description: error.message || 'No se pudo completar el registro',
      });
    },
  });

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    authService.logout();

    // Limpiar cache de React Query
    queryClient.clear();

    toast({
      title: 'Sesión cerrada',
      description: 'Ha cerrado sesión exitosamente',
    });

    // Redirigir a auth
    navigate('/auth');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = authService.isAuthenticated();

  /**
   * Obtener datos del usuario actual
   */
  const currentUser = authService.getCurrentUser();

  /**
   * Verificar si el usuario es admin
   */
  const isAdmin = authService.isAdmin();

  return {
    // Mutations
    loginMutation,
    registerMutation,

    // Functions
    logout,

    // State
    isAuthenticated,
    currentUser,
    isAdmin,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
