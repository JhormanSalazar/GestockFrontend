// This component is used to manage the authentication state of the user
import { type StateCreator } from "zustand" 
import type { User } from "../../types/auth";
import type { NotificationSliceType } from "./notificationSlice";

export type AuthState = {
  isLoggedIn: boolean;
  user: User
  setIsLoggedIn: () => void
  setUser: (user: User) => void
  setId: (user: User, id: string) => void
}

export const authSlice: StateCreator<AuthState & NotificationSliceType, [], [], AuthState> = (set, get) => ({
  isLoggedIn: false,
  user: {
    email: "",
    password: "",
    id: "",
    role: "user"
  },

  setIsLoggedIn: () => {
    set({
      isLoggedIn: true
    })
    get().showNotification({
      text: "Usuario logueado correctamente",
      error: false
    })
  },

  setUser: (user) => {
    set({
      user: {
        ...user,
        email: user.email,
        password: user.password,
        role: user.role
      }
    })
  },

  setId: (user: User, id: string) => {
    set({
      user: {...user, id}
    })
  }
})