/**
 * useBusiness Hook
 *
 * Custom hook para manejo de negocios con React Query.
 * Proporciona queries para operaciones de lectura de business entities.
 *
 * @module useBusiness
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para obtener el negocio actual del usuario autenticado
 *
 * @returns {Object} Query del negocio actual
 *
 * @example
 * function BusinessProfile() {
 *   const { business, isLoading } = useCurrentBusiness();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{business.name}</div>;
 * }
 */
export const useCurrentBusiness = () => {
  const {
    data: business,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['business', 'current'],
    queryFn: () => businessService.getCurrentBusiness(),
    staleTime: 10 * 60 * 1000, // 10 minutos (los datos del negocio cambian poco)
    retry: 1, // Solo reintentar una vez si falla
  });

  return {
    business,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook para obtener un negocio específico por ID
 *
 * @param {number} businessId - ID del negocio
 * @returns {Object} Query del negocio específico
 *
 * @example
 * function BusinessDetail({ id }) {
 *   const { business, isLoading } = useBusiness(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{business.name}</div>;
 * }
 */
export const useBusiness = (businessId) => {
  const {
    data: business,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => businessService.getById(businessId),
    enabled: !!businessId, // Solo ejecutar si hay ID
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    business,
    isLoading,
    isError,
    error,
  };
};

/**
 * Hook para obtener todos los negocios (requiere rol ADMIN)
 *
 * @returns {Object} Query de todos los negocios
 *
 * @example
 * function AllBusinesses() {
 *   const { businesses, isLoading } = useAllBusinesses();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{businesses.map(b => <div key={b.id}>{b.name}</div>)}</div>;
 * }
 */
export const useAllBusinesses = () => {
  const {
    data: businesses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => businessService.getAll(),
    enabled: false, // Solo ejecutar manualmente (requiere ADMIN)
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    businesses,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook para actualizar un negocio
 *
 * @returns {Object} Mutation para actualizar negocio
 *
 * @example
 * function BusinessSettings() {
 *   const { updateBusiness } = useUpdateBusiness();
 *
 *   const handleUpdate = () => {
 *     updateBusiness.mutate({
 *       id: 123,
 *       data: { name: 'Nuevo Nombre' }
 *     });
 *   };
 *
 *   return <button onClick={handleUpdate}>Actualizar</button>;
 * }
 */
export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBusiness = useMutation({
    mutationFn: ({ id, data }) => businessService.update(id, data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['business'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });

      toast({
        title: 'Negocio actualizado',
        description: `El negocio ha sido actualizado exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar negocio',
        description: error.message || 'No se pudo actualizar el negocio',
      });
    },
  });

  return {
    updateBusiness,
    isUpdating: updateBusiness.isPending,
  };
};
