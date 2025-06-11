import { useAppStore } from "../stores/useAppStore"
import type { ProductFormData, ProductFormType, Products } from "../types/products";

export const useProduct = () => {
  const createProduct = useAppStore((state) => state.createProduct)
  // const updateProduct = useAppStore((state) => state.updateProduct)
  const products = useAppStore((state) => state.products)

  // Función para sincronizar con localStorage
  const syncWithLocalStorage = (products: Products[]) => {
    localStorage.setItem('products', JSON.stringify(products));
  }

  const handleCreateProduct = (formData: ProductFormData) => {
    // Transformar los datos del formulario
    const formattedData: ProductFormType = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    const newProduct = {
      ...formattedData,
      id: Date.now(),
      createdAt: new Date().toISOString(), // TODO: Formatear la fecha
      updatedAt: new Date().toISOString(), // TODO: Formatear la fecha
    }

    // Añadir el producto al store
    createProduct(newProduct);

    // Añadir el producto a localStorage con el nuevo producto incluido
    syncWithLocalStorage([ ...products, newProduct]);
  }

  // const handleUpdateProduct = () => {

  // }

  return {
    createProduct: handleCreateProduct,

  }
}