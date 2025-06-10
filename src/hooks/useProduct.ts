import { useAppStore } from "../stores/useAppStore"
import type { ProductFormData, ProductFormType } from "../types/products";

export const useProduct = () => {
  const createProduct = useAppStore((state) => state.createProduct)

  const handleCreateProduct = (formData: ProductFormData) => {
    // Transformar los datos del formulario

    const formattedData: ProductFormType = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    // Añadir el producto al store
    createProduct({
      ...formattedData,
      id: Date.now(),
      createdAt: new Date().toISOString(), // TODO: Formatear la fecha
      updatedAt: new Date().toISOString(), // TODO: Formatear la fecha
    });
  }

  return {
    createProduct: handleCreateProduct,
  }
}