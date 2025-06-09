import { z } from "zod";

export const productsSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  category: z.string(),
  image: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})