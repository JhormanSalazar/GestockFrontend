import { create } from "zustand";
import {devtools} from "zustand/middleware";
import { authSlice, type AuthState } from "./slices/authSlice";
import { createNotificationSlice, type NotificationSliceType } from "./slices/notificationSlice";

export const useAppStore = create<AuthState & NotificationSliceType>()(devtools((...a) => ({
  ...authSlice(...a),
  ...createNotificationSlice(...a)
})))