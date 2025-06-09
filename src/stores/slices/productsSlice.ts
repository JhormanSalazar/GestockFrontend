import type { StateCreator } from "zustand";
import type { Products } from "../../types/products";

export type ProductSlice = {
  products: Products[]
  isLoading: boolean
  createProduct: (product: Products) => void
  updateProduct: (id: number, product: Products) => void
  deleteProduct: (id: number) => void
  getProductByCategory: (category: string) => Products[]
}

export const createProducsSlice : StateCreator<ProductSlice, [], [], ProductSlice> = (set, get) => ({
  products: [],
  isLoading: false,

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
  }
})