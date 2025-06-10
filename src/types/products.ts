import { z } from "zod";
import type { productFormSchema, productWithIdSchema } from "../schemas/productFormSchema";

export type Products = z.infer<typeof productWithIdSchema>

// Tipo inferido del schema
export type ProductFormType = z.infer<typeof productFormSchema>;