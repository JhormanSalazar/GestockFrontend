import type { StateCreator } from "zustand";
import type { Products } from "../../types/products";

// Función para obtener el estado inicial desde localStorage
const getInitialProductsState = () => {
  const savedProducts = localStorage.getItem('products');
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  return [];
}

export type ProductSlice = {
  products: Products[],
  activeId: Products['id'] | null,
  createProduct: (product: Products) => void
  updateProduct: (id: number, product: Products) => void
  deleteProduct: (id: number) => void
  getProductByCategory: (category: string) => Products[],
  getProductById: (id: Products['id']) => void
}

export const createProducsSlice : StateCreator<ProductSlice, [], [], ProductSlice> = (set, get) => ({
  products: getInitialProductsState(),
  activeId: null,

  createProduct: (product) => {
    set({
      products: [ ...get().products, product]
    })
  },

  updateProduct: (id, updatedProduct) => {
    set({
      products: get().products.map(p => 
        p.id === id ? { ...p, ...updatedProduct } : p
      )
    })
  },

  deleteProduct: (id) => {
    set({
      products: get().products.filter(p => p.id !== id)
    })
  },

  getProductByCategory: (category) => {
    return get().products.filter(p => p.category === category)
  },

  getProductById: (id) => {
    set({
      activeId: id
    })
  },
})