import { z } from "zod";
import type { productsSchema } from "../schemas/productsSchema";

export type Products = z.infer<typeof productsSchema>