import { create } from "zustand";
import {devtools} from "zustand/middleware";
import { authSlice, type AuthState } from "./slices/authSlice";
import { createNotificationSlice, type NotificationSliceType } from "./slices/notificationSlice";
import { createProducsSlice, type ProductSlice } from "./slices/productsSlice";

export const useAppStore = create<AuthState & NotificationSliceType & ProductSlice>()(devtools((...a) => ({
  ...authSlice(...a),
  ...createNotificationSlice(...a),
  ...createProducsSlice(...a)
})))