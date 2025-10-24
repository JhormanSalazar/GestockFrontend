/**
 * useWarehouses Hook
 *
 * Custom hook para manejo de bodegas con React Query.
 * Proporciona queries y mutations para operaciones CRUD de warehouses.
 *
 * @module useWarehouses
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseService } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook de gestión de bodegas
 *
 * @returns {Object} Queries y mutations de bodegas
 *
 * @example
 * function WarehousesPage() {
 *   const { warehouses, createWarehouse, isLoading } = useWarehouses();
 *
 *   const handleCreate = () => {
 *     createWarehouse.mutate({ name: 'Bodega Central', address: 'Calle 123' });
 *   };
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{warehouses.map(w => <div key={w.id}>{w.name}</div>)}</div>;
 * }
 */
export const useWarehouses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Query para obtener todas las bodegas del negocio actual
   */
  const {
    data: warehouses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseService.getByBusinessId(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  /**
   * Query para obtener todas las bodegas (solo ADMIN)
   */
  const {
    data: allWarehouses = [],
    isLoading: isLoadingAll,
  } = useQuery({
    queryKey: ['warehouses', 'all'],
    queryFn: () => warehouseService.getAll(),
    enabled: false, // Solo ejecutar manualmente cuando se necesite
  });

  /**
   * Mutation para crear una nueva bodega
   */
  const createWarehouse = useMutation({
    mutationFn: (warehouseData) => warehouseService.create(warehouseData),
    onSuccess: (data) => {
      // Invalidar y refetch de la lista de bodegas
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });

      toast({
        title: 'Bodega creada',
        description: `La bodega "${data.name}" ha sido creada exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al crear bodega',
        description: error.message || 'No se pudo crear la bodega',
      });
    },
  });

  /**
   * Mutation para actualizar una bodega
   */
  const updateWarehouse = useMutation({
    mutationFn: ({ id, data }) => warehouseService.update(id, data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', data.id] });

      toast({
        title: 'Bodega actualizada',
        description: `La bodega "${data.name}" ha sido actualizada exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar bodega',
        description: error.message || 'No se pudo actualizar la bodega',
      });
    },
  });

  /**
   * Mutation para eliminar una bodega
   */
  const deleteWarehouse = useMutation({
    mutationFn: (warehouseId) => warehouseService.delete(warehouseId),
    onSuccess: (_, warehouseId) => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.removeQueries({ queryKey: ['warehouse', warehouseId] });

      toast({
        title: 'Bodega eliminada',
        description: 'La bodega ha sido eliminada exitosamente',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar bodega',
        description: error.message || 'No se pudo eliminar la bodega',
      });
    },
  });

  return {
    // Data
    warehouses,
    allWarehouses,

    // Loading states
    isLoading,
    isLoadingAll,

    // Error states
    isError,
    error,

    // Functions
    refetch,

    // Mutations
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,

    // Mutation states
    isCreating: createWarehouse.isPending,
    isUpdating: updateWarehouse.isPending,
    isDeleting: deleteWarehouse.isPending,
  };
};

/**
 * Hook para obtener una bodega específica por ID
 *
 * @param {number} warehouseId - ID de la bodega
 * @returns {Object} Query de la bodega específica
 *
 * @example
 * function WarehouseDetail({ id }) {
 *   const { warehouse, isLoading } = useWarehouse(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{warehouse.name}</div>;
 * }
 */
export const useWarehouse = (warehouseId) => {
  const {
    data: warehouse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => warehouseService.getById(warehouseId),
    enabled: !!warehouseId, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    warehouse,
    isLoading,
    isError,
    error,
  };
};
