import axios from 'axios'
import tokenService from './tokenService'
import useAuthStore from '../../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 15000,
});

// request interceptor to add token
api.interceptors.request.use((config) => {
  try {
    const token = tokenService.getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

// response interceptor: handle 401 globally
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        // clear auth store and local storage
        const { clearAuth } = useAuthStore.getState()
        if (clearAuth) clearAuth()
      } catch (e) {}
      try {
        tokenService.logout()
      } catch (e) {}
      // redirect to login (no history here) — use location
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
