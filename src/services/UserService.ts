import axios from 'axios';
import { apiURL } from '../helpers/api';
import { 
  userSchema, 
  createUserSchema, 
  updateUserSchema, 
  usersArraySchema 
} from '../schemas/userSchema';
import type { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  DeleteUserResponse 
} from '../types/auth';

// Get all users 
export async function getUsers(): Promise<User[]> {
  try {
    const url = apiURL("users");
    const { data } = await axios.get(url);
    
    const result = usersArraySchema.safeParse(data);

    if (!result.success) {
      throw new Error('Invalid users data');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  try {
    const url = apiURL(`users/${id}`);
    const { data } = await axios.get(url);
    const result = userSchema.safeParse(data);

    if (!result.success) {
      throw new Error('Invalid user data');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    // Validar datos de entrada
    const validatedData = createUserSchema.parse(userData);
    
    const url = apiURL("users");
    const { data } = await axios.post(url, validatedData);
    const result = userSchema.safeParse(data);

    if (!result.success) {
      throw new Error('Invalid user data received from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// update an existing user
export async function updateUser(userData: UpdateUserData): Promise<User> {
  try {
    // Validar datos de entrada
    const validatedData = updateUserSchema.parse(userData);
    const { id, ...updateData } = validatedData;
    
    const url = apiURL(`users/${id}`);
    const { data } = await axios.put(url, updateData);
    const result = userSchema.safeParse(data);

    if (!result.success) {
      throw new Error('Invalid user data received from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete a user 
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  try {
    const url = apiURL(`users/${id}`);
    await axios.delete(url);
    
    // Return the ID of the deleted user for confirmation
    return { id, deleted: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
