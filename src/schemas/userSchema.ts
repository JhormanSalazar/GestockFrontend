import { z } from "zod";

export const userSchema = z.object({
  email: z.string(),
  password: z.string(),
  id: z.string(),
  role: z.enum(["admin", "user"])
})