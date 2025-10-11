import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["admin", "user"])
});

// Create user without ID 
export const createUserSchema = userSchema;

// Update user schema with optional fields and ID
export const updateUserSchema = z.object({
  id: z.string(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Mínimo 6 caracteres").optional(),
  role: z.enum(["admin", "user"]).optional()
});

// Validate array of users
export const usersArraySchema = z.array(userSchema);