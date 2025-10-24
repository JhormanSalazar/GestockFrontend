/**
 * useUsers Hook
 *
 * Custom hook para manejo de usuarios con React Query.
 * Proporciona queries y mutations para operaciones de usuarios.
 *
 * NOTA: La mayoría de operaciones requieren rol ADMIN.
 *
 * @module useUsers
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para obtener todos los usuarios (requiere rol ADMIN)
 *
 * @returns {Object} Query de usuarios
 *
 * @example
 * function UsersPage() {
 *   const { users, isLoading } = useUsers();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{users.map(u => <div key={u.id}>{u.email}</div>)}</div>;
 * }
 */
export const useUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Query para obtener todos los usuarios
   */
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
    enabled: false, // Solo ejecutar manualmente (requiere ADMIN)
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  /**
   * Mutation para crear un nuevo usuario
   */
  const createUser = useMutation({
    mutationFn: (userData) => userService.create(userData),
    onSuccess: (data) => {
      // Invalidar y refetch de la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ['users'] });

      toast({
        title: 'Usuario creado',
        description: `El usuario "${data.email}" ha sido creado exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al crear usuario',
        description: error.message || 'No se pudo crear el usuario',
      });
    },
  });

  /**
   * Mutation para actualizar un usuario
   */
  const updateUser = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });

      toast({
        title: 'Usuario actualizado',
        description: `El usuario ha sido actualizado exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar usuario',
        description: error.message || 'No se pudo actualizar el usuario',
      });
    },
  });

  /**
   * Mutation para eliminar un usuario
   */
  const deleteUser = useMutation({
    mutationFn: (userId) => userService.delete(userId),
    onSuccess: (_, userId) => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user', userId] });

      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar usuario',
        description: error.message || 'No se pudo eliminar el usuario',
      });
    },
  });

  return {
    // Data
    users,

    // Loading states
    isLoading,

    // Error states
    isError,
    error,

    // Functions
    refetch,

    // Mutations
    createUser,
    updateUser,
    deleteUser,

    // Mutation states
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
  };
};

/**
 * Hook para obtener un usuario específico por ID (requiere rol ADMIN)
 *
 * @param {number} userId - ID del usuario
 * @returns {Object} Query del usuario específico
 *
 * @example
 * function UserDetail({ id }) {
 *   const { user, isLoading } = useUser(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{user.email} - {user.roleName}</div>;
 * }
 */
export const useUser = (userId) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    user,
    isLoading,
    isError,
    error,
  };
};
