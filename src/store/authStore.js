import { create } from 'zustand'

const STORAGE_KEY = 'gestock_auth'

const getInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    return JSON.parse(raw)
  } catch (e) {
    return { token: null, user: null }
  }
}

export const useAuthStore = create((set, get) => ({
  ...getInitial(),
  setAuth: (token, user) => {
    set({ token, user })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } catch (e) {
      // ignore
    }
  },
  clearAuth: () => {
    set({ token: null, user: null })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
  }
}))

export default useAuthStore
