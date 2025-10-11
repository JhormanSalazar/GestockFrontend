import { z } from "zod";
import { 
  userSchema, 
  createUserSchema, 
  updateUserSchema 
} from "../schemas/userSchema";

export type User = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;

// Type for delete user response
export type DeleteUserResponse = {
  id: string;
  deleted: boolean;
};