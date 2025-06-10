import { z } from "zod";
import type { productFormSchema, productWithIdSchema } from "../schemas/productFormSchema";

export type Products = z.infer<typeof productWithIdSchema>

// Tipo para el formulario antes de la transformación
export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

// Tipo inferido del schema (después de la transformación)
export type ProductFormType = z.infer<typeof productFormSchema>;