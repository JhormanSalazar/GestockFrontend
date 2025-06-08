import { z } from "zod";
import type loginSchema from "../schemas/loginSchema";

export type LoginSchema = z.infer<typeof loginSchema>