import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseProductService } from '@/services';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para obtener productos por almacén (query)
 * @param {number} warehouseId - ID del almacén
 */
export const useWarehouseProducts = (warehouseId) => {
  return useQuery({
    queryKey: ['warehouse-products', warehouseId],
    queryFn: () => warehouseProductService.getByWarehouse(warehouseId),
    enabled: !!warehouseId, // Solo ejecutar si hay warehouseId
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener todos los productos del negocio (query)
 */
export const useBusinessWarehouseProducts = () => {
  return useQuery({
    queryKey: ['warehouse-products', 'business'],
    queryFn: () => warehouseProductService.getByBusiness(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un producto específico en un almacén (query)
 * @param {number} productId - ID del producto
 * @param {number} warehouseId - ID del almacén
 */
export const useWarehouseProduct = (productId, warehouseId) => {
  return useQuery({
    queryKey: ['warehouse-product', productId, warehouseId],
    queryFn: () => warehouseProductService.getById(productId, warehouseId),
    enabled: !!productId && !!warehouseId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para crear un producto en almacén (mutation)
 */
export const useCreateWarehouseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => warehouseProductService.create(data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-product'] });

      toast({
        title: 'Producto agregado al almacén',
        description: 'El producto se ha agregado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error al agregar producto',
        description: error.message || 'No se pudo agregar el producto al almacén',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para actualizar stock de un producto en almacén (mutation)
 */
export const useUpdateWarehouseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, warehouseId, data }) =>
      warehouseProductService.update(productId, warehouseId, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
      queryClient.invalidateQueries({
        queryKey: ['warehouse-product', variables.productId, variables.warehouseId]
      });

      toast({
        title: 'Stock actualizado',
        description: 'El stock se ha actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error al actualizar stock',
        description: error.message || 'No se pudo actualizar el stock',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para eliminar un producto de un almacén (mutation)
 */
export const useDeleteWarehouseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, warehouseId }) =>
      warehouseProductService.delete(productId, warehouseId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
      queryClient.invalidateQueries({
        queryKey: ['warehouse-product', variables.productId, variables.warehouseId]
      });

      toast({
        title: 'Producto eliminado del almacén',
        description: 'El producto se ha eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error al eliminar producto',
        description: error.message || 'No se pudo eliminar el producto del almacén',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook principal que combina queries y mutations para productos de almacén
 * @param {number} warehouseId - ID del almacén (opcional)
 */
export default function useWarehouseProductsManagement(warehouseId) {
  const { data: products, isLoading, isError, error } = useWarehouseProducts(warehouseId);
  const createMutation = useCreateWarehouseProduct();
  const updateMutation = useUpdateWarehouseProduct();
  const deleteMutation = useDeleteWarehouseProduct();

  return {
    // Data
    products,
    isLoading,
    isError,
    error,

    // Mutations
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
