/**
 * useProducts Hook
 *
 * Custom hook para manejo de productos con React Query.
 * Proporciona queries y mutations para operaciones CRUD de products.
 *
 * @module useProducts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook de gestión de productos
 *
 * @returns {Object} Queries y mutations de productos
 *
 * @example
 * function ProductsPage() {
 *   const { products, createProduct, isLoading } = useProducts();
 *
 *   const handleCreate = () => {
 *     createProduct.mutate({
 *       name: 'Laptop HP',
 *       price: 1500000,
 *       description: 'Laptop HP 15.6"'
 *     });
 *   };
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>;
 * }
 */
export const useProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Query para obtener todos los productos del negocio actual
   */
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getByBusinessId(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  /**
   * Mutation para crear un nuevo producto (requiere ADMIN)
   */
  const createProduct = useMutation({
    mutationFn: (productData) => productService.create(productData),
    onSuccess: (data) => {
      // Invalidar y refetch de la lista de productos
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast({
        title: 'Producto creado',
        description: `El producto "${data.name}" ha sido creado exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al crear producto',
        description: error.message || 'No se pudo crear el producto',
      });
    },
  });

  /**
   * Mutation para actualizar un producto
   */
  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });

      toast({
        title: 'Producto actualizado',
        description: `El producto "${data.name}" ha sido actualizado exitosamente`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar producto',
        description: error.message || 'No se pudo actualizar el producto',
      });
    },
  });

  /**
   * Mutation para eliminar un producto
   */
  const deleteProduct = useMutation({
    mutationFn: (productId) => productService.delete(productId),
    onSuccess: (_, productId) => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['product', productId] });

      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar producto',
        description: error.message || 'No se pudo eliminar el producto',
      });
    },
  });

  /**
   * Función para buscar productos (búsqueda local)
   */
  const searchProducts = (searchTerm) => {
    return productService.search(searchTerm, products);
  };

  /**
   * Función para filtrar productos por precio (filtrado local)
   */
  const filterByPrice = (minPrice, maxPrice) => {
    return productService.filterByPriceRange(minPrice, maxPrice, products);
  };

  return {
    // Data
    products,

    // Loading states
    isLoading,

    // Error states
    isError,
    error,

    // Functions
    refetch,
    searchProducts,
    filterByPrice,
    formatPrice: productService.formatPrice.bind(productService),

    // Mutations
    createProduct,
    updateProduct,
    deleteProduct,

    // Mutation states
    isCreating: createProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
};

/**
 * Hook para obtener un producto específico por ID
 *
 * @param {number} productId - ID del producto
 * @returns {Object} Query del producto específico
 *
 * @example
 * function ProductDetail({ id }) {
 *   const { product, isLoading } = useProduct(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return <div>{product.name} - {product.price}</div>;
 * }
 */
export const useProduct = (productId) => {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    product,
    isLoading,
    isError,
    error,
  };
};
