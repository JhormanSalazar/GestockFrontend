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

// Función para obtener el estado inicial desde localStorage
const getInitialState = () => {
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      isLoggedIn: parsedState.isLoggedIn,
      user: parsedState.user,
      id: parsedState.id
    };
  }
  return {
    isLoggedIn: false,
    user: {
      email: "",
      password: "",
      id: "",
      role: "user"
    }
  };
};

export const authSlice: StateCreator<AuthState & NotificationSliceType, [], [], AuthState> = (set, get) => {
  const initialState = getInitialState();
  
  return {
    isLoggedIn: initialState.isLoggedIn,
    user: initialState.user,

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
  }
}