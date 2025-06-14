import { z } from "zod";
// Schemas principales para el formulario de productos y el producto con id

// Schema específico para el formulario (sin id y fechas)
export const productFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  price: z.string()
    .min(1, { message: "El precio es requerido" })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, { message: "El precio debe ser un número válido mayor a 0" }),
  stock: z.string()
    .min(1, { message: "El stock es requerido" })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, { message: "El stock debe ser un número válido mayor o igual a 0" }),
  category: z.string().min(1, { message: "La categoría es requerida" }),
  image: z.string().min(1, { message: "La imagen es requerida" }),
});

export const productWithIdSchema = productFormSchema.extend({ 
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})