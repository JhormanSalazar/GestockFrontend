import { z } from "zod";
import type { productsSchema } from "../schemas/productsSchema";

export type ProductsSchema = z.infer<typeof productsSchema>