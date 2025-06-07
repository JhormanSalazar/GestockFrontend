// This component is used to manage the authentication state of the user
import { type StateCreator } from "zustand" 
import type { User } from "../../types/auth";
import { getRandomId } from "../../helpers/getRandomId";

export type AuthState = {
  isLoggedIn: boolean;
  user: User
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setUser: (user: User) => void
}

export const authSlice: StateCreator<AuthState> = (set) => ({
  isLoggedIn: false,
  user: {
    email: "",
    password: "",
    id: getRandomId(),
    role: "user"
  },

  setIsLoggedIn: (isLoggedIn) => {
    console.log(isLoggedIn)
  },

  setUser: (user) => {
    set({
      // Tomar una copiar del usuario
      user: {
        ...user,
        email: user.email,
        password: user.password,
        id: user.id,
        role: user.role
      }
    })
  }
})