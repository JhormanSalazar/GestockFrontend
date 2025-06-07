import { create } from "zustand";
import {devtools} from "zustand/middleware";

export const useAppStore = create(devtools(() => ({
  
})))