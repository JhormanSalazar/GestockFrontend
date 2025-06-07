import { create } from "zustand";
import {devtools} from "zustand/middleware";
import { authSlice, type AuthState } from "./slices/authSlice";

export const useAppStore = create<AuthState>()(devtools((...a) => ({
  ...authSlice(...a)
})))