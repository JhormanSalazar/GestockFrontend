import { useAppStore } from "../stores/useAppStore"
import type { ProductFormType } from "../types/products";

export const useProduct = () => {
  const createProduct = useAppStore((state) => state.createProduct)

  const handleCreateProduct = (formData: ProductFormType) => {
    // Transformar los datos del formulario

    // Añadir el producto al store
    createProduct({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(), // TODO: Formatear la fecha
      updatedAt: new Date().toISOString(), // TODO: Formatear la fecha
    });
  }

  return {
    createProduct: handleCreateProduct,
  }
}