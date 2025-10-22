import api from './axiosInstance'
import useAuthStore from '../../store/authStore'

const TOKEN_KEY = 'access_token'

const saveToken = (token) => {
	localStorage.setItem(TOKEN_KEY, token)
}

const getToken = () => localStorage.getItem(TOKEN_KEY)

const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const login = async ({ email, password }) => {
	try {
		const resp = await api.post('/auth/login', { email, password })
		const token = resp?.data?.accessToken || resp?.data?.token || resp?.jwt
		if (!token) throw new Error('No se recibió token')
		saveToken(token)
		return resp.data
	} catch (err) {
		const message = err?.response?.data || err?.message || 'Error de autenticación'
		throw new Error(message)
	}
}

const logout = () => {
	try {
		const { clearAuth } = useAuthStore.getState()
		if (clearAuth) clearAuth()
	} catch (e) {}
	clearToken()
	if (typeof window !== 'undefined') window.location.href = '/login'
}

export default {
	login,
	logout,
	getToken,
	saveToken,
}
