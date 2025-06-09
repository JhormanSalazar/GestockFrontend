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

  createProduct: () => {

  },

  updateProduct: () => {

  },

  deleteProduct: () => {

  },

  getProductByCategory: () => {

  }
})